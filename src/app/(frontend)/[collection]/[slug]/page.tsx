import { RenderBlocks } from "@/components/RenderBlocks"
import { RenderCollection } from "@/components/RenderCollection"
import { RenderCollectionView } from "@/components/RenderCollectionView"
import config from '@payload-config'
import { draftMode } from "next/headers"
import { notFound } from "next/navigation"
import { CollectionSlug, getPayload } from "payload"
import { Suspense } from "react"


export default async function Page(props: { params: Promise<{ collection: CollectionSlug, slug: string }> }) {
    const params = await props.params
    const page = await queryPageBySlug({
        slug: params.slug
    })

    if (!page && !params.slug && !params.collection) {
        return notFound()
    }

    if (page?.enableCollection) {
        return (
            <Suspense fallback='Loading Collection ...'>
                <RenderCollection collectionSlug={page?.configuredCollectionSlug as any} />
            </Suspense>
        )
    }

    if (Boolean(page?.layout?.length)) {
        return <RenderBlocks blocks={page?.layout} />
    }

    return (
        <Suspense fallback='loading view ....'>
            <RenderCollectionView collectionSlug={params.collection} slug={params.slug} />
        </Suspense>
    )
}




const queryPageBySlug = async ({ slug }: { slug: string }) => {
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


