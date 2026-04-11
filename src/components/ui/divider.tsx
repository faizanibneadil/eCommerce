import type React from "react";

export function Divider({
    children,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div className="relative flex w-full items-center" {...props}>
            <div className="w-full border-t" />
            <div className="flex w-max justify-center text-nowrap px-2 text-muted-foreground text-xs">
                {children}
            </div>
            <div className="w-full border-t" />
        </div>
    );
}
