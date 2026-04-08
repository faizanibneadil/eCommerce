import config from '@payload-config'
import { draftMode } from 'next/headers'
import { CollectionSlug, getPayload } from 'payload'
export const queryPageBySlug = async ({ slug }: { slug: string }) => {
    const { isEnabled: draft } = await draftMode()

    const payload = await getPayload({ config })

    const result = await payload.find({
        collection: 'pages',
        draft,
        limit: 1,
        overrideAccess: draft,
        pagination: false,
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

    return result.docs?.[0] || null
}


