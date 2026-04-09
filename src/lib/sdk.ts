import { Config } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'
import { PayloadSDK } from '@payloadcms/sdk'
import { CollectionSlug } from 'payload'

const sdk = (...tags: string[]) => new PayloadSDK<Config>({
    baseURL: new URL('/api', getServerSideURL()).toString(),
    baseInit: {
        credentials: 'include'
    },
    fetch: async (url, init) => {
        console.log({ url, init, tags })
        const searchParams = new URL(url.toString()).searchParams
        console.log({ searchParams: searchParams.toString() })
        const res = await fetch(url, { ...init, next: { tags: [...tags] } })
        return res
    }
})
