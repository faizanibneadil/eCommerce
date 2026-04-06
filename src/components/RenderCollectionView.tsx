import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug, getPayload } from "payload"
import config from '@payload-config'
import { SingleCategory } from "@/collections/Categories/components/SingleCategory"
import { SingleProduct } from "@/collections/Products/components/SingleProduct"
import { Spinner } from "./ui/spinner"

export const collectionViewMap: Record<'products' | 'categories', {
    Component: React.ComponentType<DataFromCollectionSlug<'products' | 'categories'>>,
    Skeleton: React.ComponentType<any>
}> = {
    categories: {
        Component: SingleCategory,
        Skeleton: () => (
            <div className="h-screen flex items-center justify-center gap-4">
                <Spinner className="size-20" />
            </div>
        )
    },
    products: {
        Component: SingleProduct,
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

    const View = collectionViewMap[props.collectionSlug as 'products' | 'categories'].Component

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