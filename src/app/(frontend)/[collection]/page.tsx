import { PayloadRedirects } from "@/components/PayloadRedirects"
import { RenderCollection, collectionMap } from "@/components/RenderCollection"
import { CollectionSlug } from "payload"
import { Suspense } from "react"

export default async function Page(props: {
    params: Promise<{ collection: CollectionSlug }>
}) {
    const params = await props.params

    const Skeleton = collectionMap[params.collection as 'products' | 'categories']?.Skeleton || (() => null)

    return (
        <>
            <Suspense fallback='Redirecting ...'>
                <PayloadRedirects url={`/${params.collection}`} />
            </Suspense>
            <Suspense fallback={<Skeleton />}>
                <RenderCollection collectionSlug={params.collection as any} />
            </Suspense>
        </>
    )
}
