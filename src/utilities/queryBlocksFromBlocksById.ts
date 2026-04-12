import config from '@payload-config'
import { getPayload } from 'payload'

export const queryBlocksFromBlocksById = async ({ id }: { id: number }) => {
    console.log('query blocks from', id)
    const payload = await getPayload({ config })
    const blocks = await payload.findByID({
        collection: 'blocks',
        id
    })

    return blocks?.blocks ?? []
}