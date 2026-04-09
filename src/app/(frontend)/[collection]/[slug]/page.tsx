import { PayloadRedirects } from "@/components/PayloadRedirects";
import { RenderBlocks } from "@/components/RenderBlocks";
import { RenderCollection, collectionMap } from "@/components/RenderCollection";
import { RenderCollectionView, collectionViewMap } from "@/components/RenderCollectionView";
import { getMediaUrl } from "@/utilities/getURL";
import { queryCollectionCountBySlug } from "@/utilities/queryCollectionCountBySlug";
import { queryCollectionViewBySlug } from "@/utilities/queryCollectionViewBySlug";
import { queryPageBySlug } from '@/utilities/queryPageBySlug';
import type { Metadata } from 'next';
import { notFound } from "next/navigation";
import { CollectionSlug } from "payload";
import { Suspense } from "react";

export const generateMetadata = async (props: {
    params: Promise<{
        collection: CollectionSlug,
        slug: string
    }>
}): Promise<Metadata> => {
    const params = await props.params

    let page = await queryPageBySlug({
        slug: params.slug
    })

    if (!page && !params.slug && !params.collection) {
        return {
            title: 'Not Found'
        }
    }

    if (page?.enableCollection && page?.configuredCollectionSlug) {
        page = await queryPageBySlug({
            slug: page?.configuredCollectionSlug as CollectionSlug
        })
    }

    if (!page && params.collection in collectionViewMap) {
        const doc = await queryCollectionViewBySlug({
            collection: params.collection,
            slug: params.slug
        })
        const metadata = collectionViewMap[params.collection as 'products' | 'categories'].metadata

        if (typeof metadata === 'function') {
            // @ts-expect-error
            return await metadata({ doc })
        }
    }

    // Fallback Page Metadata
    return {
        title: page?.meta?.title || page?.title,
        description: page?.meta?.description || page?.title,
        ...(page?.meta?.image && {
            icons: [{ url: getMediaUrl(page?.meta?.image) }]
        }),
        openGraph: {
            title: page?.meta?.title || page?.title,
            description: page?.meta?.description || page?.title,
            ...(page?.meta?.image && {
                images: {
                    url: getMediaUrl(page?.meta?.image)
                }
            })
        }
    }
};


export default async function Page(props: { params: Promise<{ collection: CollectionSlug, slug: string }> }) {
    // return null
    const params = await props.params
    const page = await queryPageBySlug({
        slug: params.slug
    })

    if (!page && !params.slug && !params.collection) {
        return notFound()
    }

    if (page?.enableCollection) {
        const queryCount = await queryCollectionCountBySlug({
            collectionSlug: page?.configuredCollectionSlug as CollectionSlug
        })
        const Skeleton = collectionMap[params.collection as 'products' | 'categories']?.Skeleton || (() => null)
        return (
            <>
                <Suspense fallback={null}>
                    <PayloadRedirects url={`/${params.collection}/${params.slug}`} />
                </Suspense>
                <Suspense fallback={<Skeleton totalDocs={queryCount?.totalDocs} />}>
                    <RenderCollection collectionSlug={page?.configuredCollectionSlug as any} />
                </Suspense>
            </>
        )
    }

    if (Boolean(page?.layout?.length)) {
        return <RenderBlocks blocks={page?.layout} />
    }

    const Skeleton = collectionViewMap[params.collection as 'products' | 'categories']?.Skeleton || (() => null)

    return (
        <>
            <Suspense fallback={null}>
                <PayloadRedirects url={`/${params.collection}/${params.slug}`} />
            </Suspense>
            <Suspense fallback={<Skeleton />}>
                <RenderCollectionView collectionSlug={params.collection} slug={params.slug} />
            </Suspense>
        </>
    )
}