import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
    return (
        <div className="h-screen flex items-center justify-center gap-4">
            <Spinner className="size-20" />
        </div>
    )
}