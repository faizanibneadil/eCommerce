import { DecoratedBox } from "@/components/DecoratedBox";
import { ShimmerEffect } from '@payloadcms/ui'


export default async function Page() {

    return (
        <DecoratedBox>
            <div className="flex items-center justify-center px-4 py-2 md:px-6 md:py-4">
                <div className="w-full max-w-sm animate-in space-y-8">
                    <div className="flex flex-col space-y-1">
                        <h1 className="font-bold text-2xl tracking-wide">My Account!</h1>
                        <p className="text-base text-muted-foreground">
                            Login or Create your Noore account.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <ShimmerEffect className="flex-1 border-0 bg-muted rounded-md" height={32} />
                        <ShimmerEffect className="flex-1 border-0 bg-muted rounded-md" height={32} />
                        <ShimmerEffect className="flex-1 border-0 bg-muted rounded-md" height={32} />
                    </div>
                </div>
            </div>
        </DecoratedBox>
    )
}