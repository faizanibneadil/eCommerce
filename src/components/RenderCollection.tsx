import { CollectionSlug, DataFromCollectionSlug, PaginatedDocs, getPayload } from "payload"
import { DecorIcon } from "./ui/decor-icon"
import { FullWidthDivider } from "./ui/full-width-divider"
import { getMediaUrl } from "@/utilities/getURL"
import Link from "next/link"
import { notFound } from "next/navigation"
import { draftMode } from "next/headers"
import config from '@payload-config'

const collectionMap: Record<'products' | 'categories', React.ComponentType<any>> = {
    products: (props: PaginatedDocs<DataFromCollectionSlug<'products'>>) => {
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
                                <img
                                    src={getMediaUrl(product?.gallery?.at(0)?.image)}
                                    className="w-full h-full object-cover"
                                    alt={product.title}
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
    categories: (props: PaginatedDocs<DataFromCollectionSlug<'categories'>>) => {
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
                                <img
                                    src={getMediaUrl(category?.image)}
                                    className="w-full h-full object-cover"
                                    alt={category?.title}
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
    }
}


export const RenderCollection: React.FC<{
    collectionSlug: 'products' | 'categories',
}> = async (props) => {

    const collection = await queryCollectionBySlug({
        collection: props.collectionSlug as CollectionSlug
    })

    if (!Boolean(collection?.docs?.length) || !props.collectionSlug) {
        return notFound()
    }

    if (props.collectionSlug in collectionMap) {
        const Collection = collectionMap[props.collectionSlug]

        return <Collection {...collection} />
    }

    return null

}


const queryCollectionBySlug = async ({ collection }: { collection: CollectionSlug }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: collection,
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