import config from '@payload-config'
import { getPayload } from 'payload'

export const queryBlocksFromBlocksById = async ({ ids }: { ids: number[] }) => {
    const payload = await getPayload({ config })
    const blocks = await payload.find({
        collection: 'blocks',
        where: {
            id: {
                in: [...ids]
            }
        }
    })

    return blocks?.docs ?? []
}