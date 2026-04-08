import config from '@payload-config'
import { CollectionSlug, getPayload } from 'payload'

export const queryCollectionCountBySlug = async ({ collectionSlug }: { collectionSlug: CollectionSlug }) => {
    const payload = await getPayload({ config })

    const result = await payload.count({
        collection: collectionSlug,
    })

    return result
}