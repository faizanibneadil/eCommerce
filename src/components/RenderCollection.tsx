import { CollectionSlug, DataFromCollectionSlug, PaginatedDocs, getPayload } from "payload"
import { DecorIcon } from "./ui/decor-icon"
import { FullWidthDivider } from "./ui/full-width-divider"
import { getBase64Blur, getMediaUrl } from "@/utilities/getURL"
import Link from "next/link"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
import config from '@payload-config'
import Image from "next/image"
import { DecoratedBox } from "./DecoratedBox"
import { ShimmerEffect } from "@payloadcms/ui"

export const collectionMap: Record<'products' | 'categories', {
    Component: React.ComponentType<PaginatedDocs<DataFromCollectionSlug<'products' | 'categories'>>>,
    Skeleton: React.ComponentType<{ totalDocs?: number }>
}> = {
    products: {
        Component: (props: PaginatedDocs<DataFromCollectionSlug<'products'>>) => {
            return (
                <div className="relative *:border-0">
                    <DecorIcon className="size-4" position="top-left" />
                    <DecorIcon className="size-4" position="top-right" />
                    <DecorIcon className="size-4" position="bottom-left" />
                    <DecorIcon className="size-4" position="bottom-right" />

                    <FullWidthDivider className="-top-px" />
                    <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                        {props?.docs?.map(product => {
                            return <Link href={`/products/${product.slug}`} key={product.id} className="flex flex-col ">
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                        placeholder="blur"
                                        blurDataURL={getBase64Blur(product?.gallery?.at(0)?.image)}
                                        src={getMediaUrl(product?.gallery?.at(0)?.image)}
                                        className="w-full h-full object-cover overflow-hidden"
                                        alt={product.title}
                                        fetchPriority="high"
                                        loading="lazy"
                                        height={40}
                                        width={200}
                                    />
                                </div>
                                <h3 className="text-sm font-medium line-clamp-2 p-2">
                                    {product?.title}
                                </h3>
                            </Link>
                        })}
                    </div>
                    <FullWidthDivider className="-bottom-px" />
                </div>
            )
        },
        Skeleton: ({ totalDocs = 4 }) => (
            <DecoratedBox>
                <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                    {Array.from({ length: totalDocs }).map((_, idx) => (
                        <div key={`products-skeleton-${idx}`} className="flex flex-col gap-px">
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
    categories: {
        Component: (props: PaginatedDocs<DataFromCollectionSlug<'categories'>>) => {
            return (
                <div className="relative *:border-0">
                    <DecorIcon className="size-4" position="top-left" />
                    <DecorIcon className="size-4" position="top-right" />
                    <DecorIcon className="size-4" position="bottom-left" />
                    <DecorIcon className="size-4" position="bottom-right" />

                    <FullWidthDivider className="-top-px" />
                    <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                        {props?.docs?.map(category => {
                            return <Link href={`/categories/${category.slug}`} key={category.id} className="flex flex-col ">
                                <div className="aspect-square overflow-hidden">
                                    <Image
                                        placeholder="blur"
                                        blurDataURL={getBase64Blur(category?.image)}
                                        src={getMediaUrl(category?.image)}
                                        className="w-full h-full object-cover overflow-hidden"
                                        alt={category?.title}
                                        fetchPriority="high"
                                        loading="lazy"
                                        height={40}
                                        width={200}
                                    />
                                </div>
                                <h3 className="text-sm font-medium line-clamp-2 p-2">
                                    {category?.title}
                                </h3>
                            </Link>
                        })}
                    </div>
                    <FullWidthDivider className="-bottom-px" />
                </div>
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


const queryCollectionBySlug = async ({ collectionSlug }: { collectionSlug: CollectionSlug }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: collectionSlug,
        draft,
        overrideAccess: draft,
        pagination: true,
        where: {
            and: [
                // {
                //     slug: {
                //         equals: slug,
                //     },
                // },
                ...(draft ? [] : [{ _status: { equals: 'published' } }]),
            ],
        },
    })

    return result
}