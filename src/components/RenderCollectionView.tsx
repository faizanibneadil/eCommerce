import { SingleCategory } from "@/collections/Categories/components/SingleCategory"
import { SingleProduct } from "@/collections/Products/components/SingleProduct"
import { queryCollectionViewBySlug } from "@/utilities/queryCollectionViewBySlug"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug } from "payload"
import { Spinner } from "./ui/spinner"
import { getMediaUrl } from "@/utilities/getURL"

export const collectionViewMap: Record<'products' | 'categories', {
    Component: React.ComponentType<DataFromCollectionSlug<'products' | 'categories'>>,
    Skeleton: React.ComponentType<any>,
    metadata: (props: {
        doc: DataFromCollectionSlug<'products' | 'categories'>
    }) => Promise<Metadata> | Metadata
}> = {
    categories: {
        Component: SingleCategory,
        metadata: ({ doc }) => {
            return {
                title: doc?.meta?.title || doc?.title,
                description: doc?.meta?.description || doc?.title,
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
        Component: SingleProduct,
        metadata: ({ doc }) => {
            return {
                title: doc?.meta?.title || doc?.title,
                description: doc?.meta?.description || doc?.title,
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

    if (!collectionView) {
        return notFound()
    }

    const View = collectionViewMap[props.collectionSlug as 'products' | 'categories']?.Component || (() => null)

    // @ts-expect-error
    return <View {...collectionView} />
}