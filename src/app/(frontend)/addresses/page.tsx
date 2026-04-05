import { Addresses } from '@/components/Addresses'
import config from '@payload-config'
import { headers as getHeaders } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Page() {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })

    if (Boolean(user) === false) {
        redirect('/login')
    }


    return <Addresses />
}