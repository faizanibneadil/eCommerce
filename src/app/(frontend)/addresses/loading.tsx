import { DecoratedBox } from "@/components/DecoratedBox";
import { ShimmerEffect } from "@payloadcms/ui";

export default function Loading() {
    return (
        <>
            <DecoratedBox>
                <div className="flex items-center justify-between px-4 py-2 md:px-6 md:py-4">
                    <div className="flex flex-col space-y-1">
                        <ShimmerEffect className="border-0 bg-muted rounded-md" height={30} width={150} />
                        <ShimmerEffect className="border-0 bg-muted rounded-md" height={16} width={300} />
                    </div>
                    <ShimmerEffect className="border-0 bg-muted rounded-md" height={16} width={100} />
                </div>
            </DecoratedBox>
            <DecoratedBox>
                <ShimmerEffect className="border-0 bg-muted rounded-md" height={100} />
            </DecoratedBox>
            <DecoratedBox>
                <ShimmerEffect className="border-0 bg-muted rounded-md" height={100} />
            </DecoratedBox>
            <DecoratedBox>
                <ShimmerEffect className="border-0 bg-muted rounded-md" height={100} />
            </DecoratedBox>
            <DecoratedBox>
                <ShimmerEffect className="border-0 bg-muted rounded-md" height={100} />
            </DecoratedBox>
        </>
    )
}