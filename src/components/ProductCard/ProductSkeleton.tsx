import { ShimmerEffect } from "@payloadcms/ui"

export const ProductSkeleton: React.FC = () => {
    return (
        <div className="flex flex-col gap-px">
            <div className="w-full aspect-square">
                <ShimmerEffect className="bg-muted animate-pulse" height='100%' width='100%' />
            </div>
            <div className="p-2">
                <ShimmerEffect className="bg-muted animate-pulse" height={16} width='100%' />
            </div>
        </div>
    )
}