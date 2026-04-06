import { DecoratedBox } from "@/components/DecoratedBox";
import { headers as getHeaders } from "next/headers";
import { getPayload } from "payload";
import config from '@payload-config'
import { redirect } from "next/navigation";
import { AccountForm } from "@/components/AccountForm";

export default async function Page() {
    const headers = await getHeaders()
    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers })

    if (Boolean(user) === false) {
        redirect('/login')
    }

    return (
        <DecoratedBox>
            <div className="flex items-center justify-center px-4 py-2 md:px-6 md:py-4">
                <div className="w-full max-w-sm animate-in space-y-8">
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-bold text-2xl tracking-wide">My Account!</h1>
                        <p className="text-base text-muted-foreground">
                            Manage your account
                        </p>
                    </div>
                    <AccountForm />
                </div>
            </div>
        </DecoratedBox>
    )
}