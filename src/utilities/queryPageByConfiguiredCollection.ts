import { CollectionSlug, getPayload } from "payload";

import config from '@payload-config'
import { draftMode } from "next/headers";

export const queryPageByConfiguredCollection = async ({ collectionSlug }: { collectionSlug: CollectionSlug }) => {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config })
    const page = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
        where: {
            and: [
                {
                    configuredCollectionSlug: {
                        equals: collectionSlug
                    }
                },
                ...(draft ? [] : [{ _status: { equals: 'published' } }]),
            ],
        },
    })

    return page?.docs?.at(0)
}