import { draftMode } from "next/headers"
import { BlockSlug, getPayload } from "payload"
import config from '@payload-config'


const blocksMap: Record<BlockSlug, React.ComponentType> = {
    "carousel-block": () => <div>Slider</div>,
    "categories-blocks": () => <div>Categories</div>,
    "products-blocks": () => <div>Products</div>
}

export default async function Page(props: { params: Promise<{ collection: string, slug: string }> }) {
    const slug = (await props.params)?.slug
    const page = await queryPageBySlug({
        slug
    })
    // console.log(page)

    if (!page && slug) {
        return null
    }

    if (page?.enableCollection) {
        return <div>
            Show Collection of {slug}
        </div>
    }



    return page?.layout?.map(block => {
        const { blockType } = block
        const Block = blocksMap[blockType]
        return <Block />
    })
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
