import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { mcpPlugin } from "@payloadcms/plugin-mcp"
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
            paymentMethods: [
                // stripeAdapter({
                //     secretKey: process.env.STRIPE_SECRET_KEY!,
                //     publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
                //     webhookSecret: process.env.STRIPE_WEBHOOKS_SIGNING_SECRET!,
                // }),
            ],
        },
        products: {
            productsCollectionOverride: ProductsCollection,
        },
    }),
    // mcpPlugin({
    //     collections: {
    //         pages: {
    //             enabled: true,
    //             description: 'This is pages collection.',
    //         },
    //         forms: {
    //             enabled: true,
    //             description: 'This form collection. this collection contain a lot of form.',
    //         },
    //         products: {
    //             enabled: true,
    //             description: 'This is products Collection'
    //         },
    //         categories: {
    //             enabled: true,
    //             description: 'this is categories collection',
    //         },
    //         variantOptions: {
    //             enabled: true,
    //             description: 'this is variants options collection this collection will connected with projects collection when you will create a product with variants'
    //         },
    //         variants: {
    //             enabled: true,
    //             description: 'this is actual variants collection, this collection will contain all the products variants'
    //         },
    //         variantTypes: {
    //             enabled: true,
    //             description: 'this is variants types collection. this collection is connected with products collection and this collection will help you when you creating a product that has variants.'
    //         }
    //     },
    //     userCollection: 'users',
    //     mcp: {
    //         serverOptions: {
    //             serverInfo: {
    //                 name: 'eCommerce MCP',
    //                 version: '1.0.0'
    //             }
    //         }
    //     }
    // }),
]