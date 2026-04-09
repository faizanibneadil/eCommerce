import { PayloadRedirects } from "@/components/PayloadRedirects";
import { RenderCollection, collectionMap } from "@/components/RenderCollection";
import { queryCollectionCountBySlug } from "@/utilities/queryCollectionCountBySlug";
import { queryPageByConfiguredCollection } from '@/utilities/queryPageByConfiguiredCollection';
import type { Metadata } from 'next';
import { CollectionSlug } from "payload";
import { Suspense } from "react";


export const generateMetadata = async (props: {
    params: Promise<{ collection: CollectionSlug }>
}): Promise<Metadata> => {
    const params = await props.params

    if (!Object.keys(collectionMap).includes(params.collection)) {
        return {
            title: '404 - Not Found.',
            description: 'Page Not Found.'
        }
    }

    const page = await queryPageByConfiguredCollection({
        collectionSlug: params.collection
    })

    if (params.collection in collectionMap) {
        const metadata = collectionMap[params.collection as 'products' | 'categories'].metadata

        if (typeof metadata === 'function') {
            return await metadata({ doc: page! })
        }

        return {}
    }

    return {}
};

export default async function Page(props: {
    params: Promise<{ collection: CollectionSlug }>
}) {
    const params = await props.params
    const queryCount = await queryCollectionCountBySlug({
        collectionSlug: params.collection
    })

    const Skeleton = collectionMap[params.collection as 'products' | 'categories']?.Skeleton || (() => null)

    return (
        <div>
            <Suspense fallback={null}>
                <PayloadRedirects url={`/${params.collection}`} />
            </Suspense>
            <Suspense fallback={<Skeleton totalDocs={queryCount.totalDocs} />}>
                <RenderCollection collectionSlug={params.collection as any} />
            </Suspense>
        </div>
    )
}
