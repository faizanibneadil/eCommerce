import config from '@payload-config'
import { draftMode } from 'next/headers'
import { CollectionSlug, getPayload } from 'payload'
export const queryCollectionViewBySlug = async ({ collection, slug }: { collection: CollectionSlug, slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: collection,
        draft,
        overrideAccess: draft,
        pagination: false,
        limit: 1,
        depth: 2,
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