import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
// import { mcpPlugin } from "@payloadcms/plugin-mcp"
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { ecommercePlugin } from '@payloadcms/plugin-ecommerce'
import { s3Storage } from '@payloadcms/storage-s3'

// import { stripeAdapter } from '@payloadcms/plugin-ecommerce/payments/stripe'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { ProductsCollection } from '@/collections/Products'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import { adminOnlyFieldAccess } from '@/access/adminOnlyFieldAccess'
import { customerOnlyFieldAccess } from '@/access/customerOnlyFieldAccess'
import { isAdmin } from '@/access/isAdmin'
import { isDocumentOwner } from '@/access/isDocumentOwner'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { defaultCountries } from '@payloadcms/plugin-ecommerce/client/react'

const generateTitle: GenerateTitle<Product | Page> = ({ doc }) => {
    return doc?.title ? `${doc.title} | Payload Ecommerce Template` : 'Payload Ecommerce Template'
}

const generateURL: GenerateURL<Product | Page> = ({ doc }) => {
    const url = getServerSideURL()

    return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
    nestedDocsPlugin({
        collections: ['categories'],
        generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    redirectsPlugin({
        collections: ['pages', 'products', 'categories'],
        redirectTypes: ['301', '302', '303', '307', '308'],
        overrides: {
            // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if ('name' in field && field.name === 'from') {
                        return {
                            ...field,
                            admin: {
                                description: 'You will need to rebuild the website when changing this field.',
                            },
                        }
                    }
                    return field
                })
            },
            hooks: {
                afterChange: [revalidateRedirects],
            },
        },
    }),
    s3Storage({
        enabled: true,
        collections: {
            media: true
        },
        bucket: process.env.S3_BUCKET!,
        config: {
            forcePathStyle: true, // Important for using Supabase
            credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY_ID!,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
            },
            region: process.env.S3_REGION,
            endpoint: process.env.S3_ENDPOINT,
        },
    }),
    seoPlugin({
        generateTitle,
        generateURL,
    }),
    formBuilderPlugin({
        fields: {
            payment: false,
        },
        formSubmissionOverrides: {
            access: {
                delete: isAdmin,
                read: isAdmin,
                update: isAdmin,
            },
            admin: {
                group: 'Content',
            },
        },
        formOverrides: {
            access: {
                delete: isAdmin,
                read: isAdmin,
                update: isAdmin,
                create: isAdmin,
            },
            admin: {
                group: 'Content',
            },
            fields: ({ defaultFields }) => {
                return defaultFields.map((field) => {
                    if ('name' in field && field.name === 'confirmationMessage') {
                        return {
                            ...field,
                            editor: lexicalEditor({
                                features: ({ rootFeatures }) => {
                                    return [
                                        ...rootFeatures,
                                        FixedToolbarFeature(),
                                        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                                    ]
                                },
                            }),
                        }
                    }
                    return field
                })
            },
        },
    }),
    ecommercePlugin({
        access: {
            adminOnlyFieldAccess,
            adminOrPublishedStatus,
            customerOnlyFieldAccess,
            isAdmin,
            isDocumentOwner,
        },
        currencies: {
            defaultCurrency: 'PKR',
            supportedCurrencies: [
                {
                    code: 'PKR',
                    label: 'Pakistani Rupees',
                    symbol: '₨',
                    decimals: 2
                }
            ]
        },
        customers: {
            slug: 'users',
        },
        orders: {
            ordersCollectionOverride: ({ defaultCollection }) => ({
                ...defaultCollection,
                fields: [
                    ...defaultCollection.fields,
                    {
                        name: 'accessToken',
                        type: 'text',
                        unique: true,
                        index: true,
                        admin: {
                            position: 'sidebar',
                            readOnly: true,
                        },
                        hooks: {
                            beforeValidate: [
                                ({ value, operation }) => {
                                    if (operation === 'create' || !value) {
                                        return crypto.randomUUID()
                                    }
                                    return value
                                },
                            ],
                        },
                    },
                ],
            }),
        },
        payments: {
            paymentMethods: [{
                name: 'cod',
                label: 'Cash On Delivery',
                confirmOrder: async ({
                    data,
                    req,
                    cartsSlug = 'carts',
                    customersSlug,
                    ordersSlug = 'orders',
                    transactionsSlug = 'transactions'
                }) => {
                    const payload = req.payload

                    const customerEmail = data?.customerEmail
                    const codOrderID = data?.orderID

                    if (!codOrderID) {
                        throw new Error('COD Order ID is required')
                    }

                    try {
                        const transactionsResults = await payload.find({
                            collection: transactionsSlug as 'transactions',
                            where: {
                                'cod.orderID': {
                                    equals: codOrderID,
                                },
                            },
                            req
                        })
                        const transaction = transactionsResults.docs[0]

                        if (!transactionsResults.totalDocs || !transaction) {
                            throw new Error('No transaction found for the provided COD Order ID')
                        }

                        const cartID = typeof transaction.cart === 'object' ? transaction?.cart?.id : transaction.cart
                        const cartItemsSnapshot = transaction.items
                        const amount = transaction.amount
                        const currency = transaction.currency

                        if (!cartID) {
                            throw new Error('Cart ID not found in the transaction')
                        }

                        if (!cartItemsSnapshot || !Array.isArray(cartItemsSnapshot)) {
                            throw new Error('Cart items snapshot not found or invalid in the transaction')
                        }

                        const shippingAddress = transaction.billingAddress

                        const order = await payload.create({
                            collection: 'orders',
                            data: {
                                amount,
                                currency,
                                ...(req.user ? { customer: req.user.id } : { customerEmail }),
                                items: cartItemsSnapshot,
                                shippingAddress,
                                status: 'processing',
                                transactions: [transaction.id],
                            },
                            req
                        })

                        const timestamp = new Date().toISOString()

                        // Update the cart as purchased
                        await payload.update({
                            id: cartID,
                            collection: cartsSlug as 'carts',
                            data: {
                                purchasedAt: timestamp,
                            },
                            req
                        })

                        // Update the transaction with the order ID and mark as validated
                        await payload.update({
                            id: transaction.id,
                            collection: transactionsSlug as 'transactions',
                            data: {
                                order: order.id,
                                status: 'succeeded',
                                cod: {
                                    ...(transaction.cod || {}),
                                    validationStatus: 'validated',
                                },
                            },
                            req
                        })

                        return {
                            message: 'COD order confirmed successfully',
                            orderID: order.id,
                            transactionID: transaction.id,
                        }
                    } catch (error) {
                        payload.logger.error(error, 'Error confirming COD order')

                        throw new Error(error instanceof Error ? error.message : 'Unknown error confirming COD order')
                    }
                },
                initiatePayment: async ({
                    data,
                    req,
                    transactionsSlug,
                    customersSlug
                }) => {
                    const payload = req.payload
                    const customerEmail = data.customerEmail
                    const currency = data.currency
                    const cart = data.cart
                    const amount = cart.subtotal
                    const billingAddressFromData = data.billingAddress
                    const shippingAddressFromData = data.shippingAddress

                    if (!currency) {
                        throw new Error('Currency is required.')
                    }

                    if (!cart || !cart.items || cart.items.length === 0) {
                        throw new Error('Cart is empty or not provided.')
                    }

                    if (!customerEmail || typeof customerEmail !== 'string') {
                        throw new Error('A valid customer email is required to make a purchase.')
                    }

                    if (!amount || typeof amount !== 'number' || amount <= 0) {
                        throw new Error('A valid amount is required to initiate a payment.')
                    }

                    try {

                        const flattenedCart = cart.items.map((item) => {
                            const productID = typeof item.product === 'object' ? item.product.id : item.product
                            const variantID = item.variant
                                ? typeof item.variant === 'object'
                                    ? item.variant.id
                                    : item.variant
                                : undefined

                            const { product: _product, variant: _variant, id: _id, ...customProperties } = item

                            return {
                                ...customProperties,
                                product: productID,
                                quantity: item.quantity,
                                ...(variantID ? { variant: variantID } : {}),
                            }
                        })

                        const orderID = `COD-${Date.now()}-${Math.random().toString(36).substring(2, 9).toUpperCase()}`

                        // Create a transaction for the COD payment
                        const _transaction = await payload.create({
                            collection: transactionsSlug as 'transactions',
                            data: {
                                ...(req.user ? { customer: req.user.id } : { customerEmail }),
                                amount,
                                billingAddress: shippingAddressFromData,
                                cart: cart.id,
                                currency: currency.toUpperCase() as unknown as any,
                                items: flattenedCart,
                                paymentMethod: 'cod',
                                status: 'pending',
                                cod: {
                                    orderID,
                                    validationStatus: 'pending',
                                    deliveryStatus: 'preparing',
                                    paymentCollected: false,
                                },
                            },
                            req
                        })


                        return {
                            message: 'COD order initiated successfully',
                            orderID,
                            transactionID: _transaction.id
                        }
                    } catch (error) {
                        payload.logger.error({ err: error, msg: 'Error initiating COD payment' })

                        throw new Error(
                            error instanceof Error ? error.message : 'Unknown error initiating COD payment',
                        )
                    }
                },
                group: {
                    name: 'cod',
                    type: 'group',
                    admin: {
                        condition: (data) => {
                            const path = 'paymentMethod'
                            return data?.[path] === 'cod'
                        },
                    },
                    fields: [
                        {
                            name: 'orderID',
                            type: 'text',
                            label: 'COD Order ID',
                        },
                        {
                            name: 'validationStatus',
                            type: 'select',
                            label: 'Validation Status',
                            options: [
                                { label: 'Pending', value: 'pending' },
                                { label: 'Validated', value: 'validated' },
                                { label: 'Rejected', value: 'rejected' },
                            ],
                            defaultValue: 'pending',
                        },
                        {
                            name: 'deliveryStatus',
                            type: 'select',
                            label: 'Delivery Status',
                            options: [
                                { label: 'Preparing', value: 'preparing' },
                                { label: 'Dispatched', value: 'dispatched' },
                                { label: 'Out for Delivery', value: 'out_for_delivery' },
                                { label: 'Delivered', value: 'delivered' },
                                { label: 'Returned', value: 'returned' },
                            ],
                            defaultValue: 'preparing',
                        },
                        {
                            name: 'paymentCollected',
                            type: 'checkbox',
                            label: 'Payment Collected',
                            defaultValue: false,
                        },
                        {
                            name: 'collectionDate',
                            type: 'date',
                            label: 'Payment Collection Date',
                            admin: {
                                condition: (data) => data?.cod?.paymentCollected === true,
                            },
                        },
                    ]
                }
            }],
        },
        products: {
            productsCollectionOverride: ProductsCollection,
        },
        addresses: {
            supportedCountries: [...defaultCountries, { label: 'Pakistan', value: 'PK' }]
        }
    })
]