import { DecorIcon } from "./ui/decor-icon"
import { FullWidthDivider } from "./ui/full-width-divider"

const _decoration = ["top-left", "top-right", "bottom-right", "bottom-left"] as const

export const DecoratedBox: React.FC<React.PropsWithChildren & {
    decoration?: ("top-left" | "top-right" | "bottom-right" | "bottom-left")[],
    dividerTop?: boolean,
    dividerBottom?: boolean
}> = ({ children, decoration = _decoration, dividerBottom = true, dividerTop = true }) => {
    return (
        <div className="relative *:border-0">
            {decoration && Array.isArray(decoration) && decoration?.map(dec => (
                <DecorIcon className="size-4" position={dec} key={dec} />
            ))}
            {Boolean(decoration?.length) === false && (
                <>
                    <DecorIcon className="size-4" position="top-left" />
                    <DecorIcon className="size-4" position="top-right" />
                    <DecorIcon className="size-4" position="bottom-left" />
                    <DecorIcon className="size-4" position="bottom-right" />
                </>
            )}

            {dividerTop && (
                <FullWidthDivider className="-top-px" />
            )}
            {children}
            {dividerBottom && (
                <FullWidthDivider className="-bottom-px" />
            )}
        </div>
    )
}