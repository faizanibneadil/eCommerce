import { getServerSideURL } from "@/utilities/getURL";
import { MetadataRoute } from "next";
import { getPayload } from "payload";
import config from '@payload-config'

export default async function Sitemap(): Promise<MetadataRoute.Sitemap> {
    const payload = await getPayload({ config })
    const pages = await payload.find({
        collection: 'pages',
        pagination: false,
        select: {
            slug: true,
            configuredCollectionSlug: true,
            updatedAt: true
        },
        where: { _status: { equals: 'published' } }
    })
    return pages?.docs?.map(page => ({
        url: page?.slug === 'home'
            ? getServerSideURL()
            : page?.configuredCollectionSlug
                ? `${getServerSideURL()}/${page?.configuredCollectionSlug}`
                : `${getServerSideURL()}/${page.slug}`,
        changeFrequency: 'daily',
        priority: 1,
        lastModified: page?.updatedAt ? new Date(page?.updatedAt) : new Date()
    }))
}