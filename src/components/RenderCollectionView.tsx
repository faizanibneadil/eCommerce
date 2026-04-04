import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { CollectionSlug, DataFromCollectionSlug, getPayload } from "payload"
import config from '@payload-config'
import { SingleCategory } from "@/collections/Categories/components/SingleCategory"
import { SingleProduct } from "@/collections/Products/components/SingleProduct"

const collectionViewMap: Record<'products' | 'categories', React.ComponentType<DataFromCollectionSlug<'products' | 'categories'>>> = {
    categories: SingleCategory,
    products: SingleProduct
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