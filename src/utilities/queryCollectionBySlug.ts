import config from '@payload-config'
import { draftMode } from 'next/headers'
import { CollectionSlug, getPayload } from 'payload'
export const queryCollectionBySlug = async ({ collectionSlug }: { collectionSlug: CollectionSlug }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: collectionSlug,
        draft,
        overrideAccess: draft,
        pagination: true,
        depth: 2,
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