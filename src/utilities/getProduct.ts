import { getPayload } from "payload"
import config from '@payload-config'
export const getProductById = async (id: string | number) => {
    const payload = await getPayload({ config })
    const product = await payload.findByID({
        collection: 'products',
        id
    })

    return product
}