'use server'
import { getPayload } from "payload"
import config from '@payload-config'

export const getMedia = async (id: number | string) => {

    const payload = await getPayload({ config })

    const media = await payload.findByID({
        collection: 'media',
        id
    })

    return media

}