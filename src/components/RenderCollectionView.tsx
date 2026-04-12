import { SingleCategory } from "@/collections/Categories/components/SingleCategory"
import { SingleProduct } from "@/collections/Products/components/SingleProduct"
import { queryCollectionViewBySlug } from "@/utilities/queryCollectionViewBySlug"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug } from "payload"
import { Spinner } from "./ui/spinner"
import { getMediaUrl, getServerSideURL } from "@/utilities/getURL"
import type { BreadcrumbList, Product, WithContext } from 'schema-dts';

export const collectionViewMap: Record<'products' | 'categories', {
    Component: React.ComponentType<DataFromCollectionSlug<'products' | 'categories'>>,
    Skeleton: React.ComponentType<any>,
    metadata: (props: {
        doc: DataFromCollectionSlug<'products' | 'categories'>
    }) => Promise<Metadata> | Metadata,
    generateJsonLDSchemas?: (props: {
        doc: DataFromCollectionSlug<'products' | 'categories'>
    }) => any[]
}> = {
    categories: {
        Component: SingleCategory,
        metadata: ({ doc }) => {
            return {
                title: doc?.meta?.title || doc?.title,
                description: doc?.meta?.description || doc?.title,
                ...(doc?.meta?.image && {
                    icons: [{ url: getMediaUrl(doc?.meta?.image) }]
                }),
                openGraph: {
                    title: doc?.meta?.title || doc?.title,
                    description: doc?.meta?.description || doc?.title,
                    ...(doc?.meta?.image && {
                        images: {
                            url: getMediaUrl(doc?.meta?.image)
                        }
                    })
                }
            }
        },
        Skeleton: () => (
            <div className="h-screen flex items-center justify-center gap-4">
                <Spinner className="size-20" />
            </div>
        )
    },
    products: {
        generateJsonLDSchemas: ({ doc }: { doc: DataFromCollectionSlug<"products"> }) => {
            const hasStock = doc?.enableVariants
                ? doc?.variants?.docs?.some((variant) => {
                    if (typeof variant !== 'object') return false
                    return variant.inventory && variant?.inventory > 0
                })
                : doc?.inventory! > 0

            let price = doc.priceInPKR
            if (doc.enableVariants && doc?.variants?.docs?.length) {
                price = doc?.variants?.docs?.reduce((acc, variant) => {
                    if (typeof variant === 'object' && variant?.priceInPKR && acc && variant?.priceInPKR > acc) {
                        return variant.priceInPKR
                    }
                    return acc
                }, price)
            }

            const productSchema: WithContext<Product> = {
                "@context": 'https://schema.org',
                "@type": 'Product',
                description: doc?.meta?.description ?? doc?.title,
                name: doc?.meta?.title ?? doc?.title,
                ...(doc?.meta?.image && typeof doc?.meta?.image === 'object' && {
                    image: typeof doc?.meta?.image === 'object' ? getMediaUrl(doc?.meta?.image) : undefined
                }),
                offers: {
                    "@type": 'AggregateOffer',
                    availability: hasStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                    price: price ?? undefined,
                    priceCurrency: 'pkr',
                }
            }

            const breadcrumbs: WithContext<BreadcrumbList> = {
                "@context": 'https://schema.org',
                "@type": 'BreadcrumbList',
                itemListElement: [
                    {
                        "@type": 'ListItem',
                        position: 1,
                        name: 'Home',
                        item: getServerSideURL()
                    },
                    {
                        "@type": 'ListItem',
                        position: 2,
                        name: 'Products',
                        item: `${getServerSideURL()}/products`
                    },
                    {
                        "@type": 'ListItem',
                        position: 3,
                        name: doc?.meta?.title ?? doc?.title,
                        item: `${getServerSideURL()}/products/${doc?.slug}`
                    }
                ]
            }

            return [productSchema, breadcrumbs]
        },
        Component: SingleProduct,
        metadata: ({ doc }) => {
            return {
                title: doc?.meta?.title || doc?.title,
                description: doc?.meta?.description || doc?.title,
                ...(doc?.meta?.image && {
                    icons: [{ url: getMediaUrl(doc?.meta?.image) }]
                }),
                openGraph: {
                    title: doc?.meta?.title || doc?.title,
                    description: doc?.meta?.description || doc?.title,
                    ...(doc?.meta?.image && {
                        images: {
                            url: getMediaUrl(doc?.meta?.image)
                        }
                    })
                }
            }
        },
        Skeleton: () => (
            <div className="h-screen flex items-center justify-center gap-4">
                <Spinner className="size-20" />
            </div>
        )
    }
}

export const RenderCollectionView: React.FC<{
    collectionSlug: CollectionSlug,
    slug: string
}> = async (props) => {
    const collectionView = await queryCollectionViewBySlug({
        collection: props.collectionSlug,
        slug: props.slug
    })

    if (!collectionView || !Object.keys(collectionViewMap).includes(props.collectionSlug)) {
        return notFound()
    }

    const View = collectionViewMap[props.collectionSlug as 'products' | 'categories']?.Component || (() => null)
    const generatedSchemas = collectionViewMap[props.collectionSlug as 'products' | 'categories']?.generateJsonLDSchemas || (() => [])

    // @ts-expect-error
    const schemas = generatedSchemas?.({ doc: collectionView }) ?? []

    return (
        <>
            {schemas?.map((schema, idx) => (
                <script
                    key={`json-lg-schema-${idx}`}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
                    }}
                />
            ))}
            {/* @ts-expect-error */}
            <View {...collectionView} />
        </>
    )
}