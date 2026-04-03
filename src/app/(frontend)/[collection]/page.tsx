import { RenderCollection } from "@/components/RenderCollection"
import { CollectionSlug } from "payload"
import { Suspense } from "react"

export default async function Page(props: {
    params: Promise<{ collection: CollectionSlug }>
}) {
    const params = await props.params

    return (
        <Suspense fallback='loading collection ...'>
            <RenderCollection collectionSlug={params.collection as any} />
        </Suspense>
    )
}
