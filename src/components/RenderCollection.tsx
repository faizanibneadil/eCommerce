import { getMedia } from "@/utilities/getMedia"
import config from '@payload-config'
import { ShimmerEffect } from "@payloadcms/ui"
import { draftMode } from "next/headers"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug, PaginatedDocs, getPayload } from "payload"
import { Suspense } from "react"
import { DecoratedBox } from "./DecoratedBox"
import { ProductCard } from "./ProductCard"
import { CMSImage } from "./ui/CMSImage"
import { ProductSkeleton } from "./ProductCard/ProductSkeleton"
import { Metadata } from "next"
import { Page } from "@/payload-types"
import { queryCollectionBySlug } from "@/utilities/queryCollectionBySlug"
import { getMediaUrl } from "@/utilities/getURL"

export const collectionMap: Record<'products' | 'categories', {
    Component: React.ComponentType<PaginatedDocs<DataFromCollectionSlug<'products' | 'categories'>>>,
    Skeleton: React.ComponentType<{ totalDocs?: number }>,
    metadata: (props: {
        doc: Page
    }) => Promise<Metadata> | Metadata
}> = {
    products: {
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
        Component: (props: PaginatedDocs<DataFromCollectionSlug<'products'>>) => {
            return (
                <DecoratedBox>
                    <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                        {props?.docs?.map(product => {
                            return (
                                <Suspense key={product.id} fallback={<ProductSkeleton />}>
                                    <ProductCard product={product} />
                                </Suspense>
                            )
                        })}
                    </div>
                </DecoratedBox>
            )
        },
        Skeleton: ({ totalDocs = 4 }) => (
            <DecoratedBox>
                <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                    {Array.from({ length: totalDocs }).map((_, idx) => (
                        <div key={`products-skeleton-${idx}`} className="flex flex-col gap-px">
                            <div className="w-full aspect-square">
                                <ShimmerEffect className="bg-muted animate-pulse" height='100%' width='100%' />
                            </div>
                            <div className="p-2">
                                <ShimmerEffect className="bg-muted animate-pulse" height={16} width='100%' />
                            </div>
                        </div>
                    ))}
                </div>
            </DecoratedBox>
        )
    },
    categories: {
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
        Component: (props: PaginatedDocs<DataFromCollectionSlug<'categories'>>) => {
            return (
                <DecoratedBox>
                    <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                        {props?.docs?.map(category => {
                            const alt = category?.title
                            const src = typeof category?.image === 'number' ? getMedia(category?.image) : category?.image
                            return <Link href={`/categories/${category.slug}`} key={category.id} className="flex flex-col ">
                                <div className="aspect-square overflow-hidden">
                                    <Suspense fallback='loading image'>
                                        <CMSImage alt={alt} src={src} />
                                    </Suspense>
                                </div>
                                <h3 className="text-sm font-medium line-clamp-2 p-2">
                                    {category?.title}
                                </h3>
                            </Link>
                        })}
                    </div>
                </DecoratedBox>
            )
        },
        Skeleton: ({ totalDocs = 4 }) => (
            <DecoratedBox>
                <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                    {Array.from({ length: totalDocs }).map((_, idx) => (
                        <div key={`categories-skeleton-${idx}`} className="flex flex-col gap-px">
                            <div className="w-full aspect-square">
                                <ShimmerEffect className="bg-muted" height='100%' width='100%' />
                            </div>
                            <div className="p-2">
                                <ShimmerEffect className="bg-muted" height={16} width='100%' />
                            </div>
                        </div>
                    ))}
                </div>
            </DecoratedBox>
        )
    },
}


export const RenderCollection: React.FC<{
    collectionSlug: 'products' | 'categories',
}> = async ({ collectionSlug }) => {
    console.log({ collectionSlug })
    // TODO: (fix) extra check because favicon.ico is coming in collection slug
    if (!Object.keys(collectionMap).includes(collectionSlug)) {
        notFound()
    }

    const collection = await queryCollectionBySlug({
        collectionSlug: collectionSlug as CollectionSlug
    })

    if (!Boolean(collection?.docs?.length) || !collectionSlug) {
        notFound()
    }

    if (collectionSlug in collectionMap) {
        const Collection = collectionMap[collectionSlug].Component

        // @ts-expect-error
        return <Collection {...collection} />
    }

    return null

}