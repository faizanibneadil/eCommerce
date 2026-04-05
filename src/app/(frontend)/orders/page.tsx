import { DecoratedBox } from '@/components/DecoratedBox'
import { OrderItem } from '@/components/OrderItem'
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

    const orders = await payload.find({
        collection: 'orders',
        limit: 0,
        pagination: false,
        user,
        overrideAccess: false,
        where: {
            customer: {
                equals: user?.id
            }
        }
    })

    if (Boolean(orders?.docs?.length) === false) {
        return (
            <DecoratedBox>
                <div className="flex items-center justify-center py-20">
                    <div className="w-full max-w-sm animate-in space-y-8">
                        <div className="flex flex-col space-y-1">
                            <h1 className="font-bold text-2xl tracking-wide">Orders</h1>
                            <p className="text-base text-muted-foreground">
                                You have no orders
                            </p>
                        </div>
                    </div>
                </div>
            </DecoratedBox>
        )
    }

    return (
        <div>
            <DecoratedBox>
                <div className="flex flex-col space-y-1 px-4 py-2 md:px-6 md:py-4">
                    <h1 className="font-bold text-2xl tracking-wide">My Orders!</h1>
                    <p className="text-base text-muted-foreground">
                        You have {orders?.docs?.length} orders
                    </p>
                </div>
            </DecoratedBox>
            {orders?.docs?.map(order => (
                <DecoratedBox key={order.id}>
                    <OrderItem order={order} />
                </DecoratedBox>
            ))}
        </div>
    )
}