import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug, getPayload } from "payload"
import config from '@payload-config'
import { DecorIcon } from "./ui/decor-icon"
import { FullWidthDivider } from "./ui/full-width-divider"
import { getMediaUrl } from "@/utilities/getURL"
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Button } from "./ui/button"
import Link from "next/link"

const collectionViewMap: Record<'products' | 'categories', React.ComponentType<DataFromCollectionSlug<'products' | 'categories'>>> = {
    categories: (props: DataFromCollectionSlug<'categories'>) => {
        return (
            <div className="relative *:border-0">
                <DecorIcon className="size-4" position="top-left" />
                <DecorIcon className="size-4" position="top-right" />
                <DecorIcon className="size-4" position="bottom-left" />
                <DecorIcon className="size-4" position="bottom-right" />

                <FullWidthDivider className="-top-px" />
                <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                    {props?.products?.docs?.map(product => {
                        return typeof product === 'number' ? null : <Link href={`/products/${product.slug}`} key={product.id} className="flex flex-col ">
                            {/* Aspect ratio use karein taake image container se bahar na nikalay */}
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
    products: (props: DataFromCollectionSlug<'products'>) => {
        return (
            <div className="relative *:border-0">
                <DecorIcon className="size-4" position="top-left" />
                <DecorIcon className="size-4" position="top-right" />
                <DecorIcon className="size-4" position="bottom-left" />
                <DecorIcon className="size-4" position="bottom-right" />

                <FullWidthDivider className="-top-px" />
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-4">
                        <div className="grid grid-cols-3 gap-px">
                            <img src={getMediaUrl(props.gallery?.at(0)?.image)} className="w-full col-span-3" />
                            {props?.gallery?.map(item => (
                                <img src={getMediaUrl(item.image)} key={item.id} className="w-full" />
                            ))}
                        </div>
                    </div>
                    <div className="col-span-8 p-2">
                        <h1 className="text-lg md:text-2xl font-medium">{props.title}</h1>
                        <div className="flex gap-px items-center py-4">
                            <Button>Add To Cart</Button>
                            <Button>Buy Now</Button>
                        </div>
                        <RichText data={props.description as SerializedEditorState} className="prose-sm  prose md:prose-md dark:prose-invert" />
                    </div>

                </div>
                <FullWidthDivider className="-bottom-px" />
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

    if (!collectionView) {
        return notFound()
    }

    const View = collectionViewMap[props.collectionSlug as 'products' | 'categories']

    // @ts-expect-error
    return <View {...collectionView} />
}

const queryCollectionViewBySlug = async ({ collection, slug }: { collection: CollectionSlug, slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: collection,
        draft,
        overrideAccess: draft,
        pagination: false,
        limit: 1,
        where: {
            and: [
                {
                    slug: {
                        equals: slug,
                    },
                },
                ...(draft ? [] : [{ _status: { equals: 'published' } }]),
            ],
        },
    })

    return result?.docs?.at(0) || null
}