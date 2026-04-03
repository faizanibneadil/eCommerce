import { DecorIcon } from "@/components/ui/decor-icon";
import { FullWidthDivider } from "@/components/ui/full-width-divider";
import { ProductsPropsTypes } from "@/payload-types";
import { getMediaUrl } from "@/utilities/getURL";
import Link from "next/link";

export function Products(props: ProductsPropsTypes) {

    return <section>
        <h2 className="py-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
            {props.label}
        </h2>
        <div className="relative *:border-0">
            <DecorIcon className="size-4" position="top-left" />
            <DecorIcon className="size-4" position="top-right" />
            <DecorIcon className="size-4" position="bottom-left" />
            <DecorIcon className="size-4" position="bottom-right" />

            <FullWidthDivider className="-top-px" />
            <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                {props?.products?.map(product => {
                    return typeof product === 'number' ? null : <Link href={`/products/${product.slug}`} key={product.id} className="flex flex-col ">
                        {/* Aspect ratio use karein taake image container se bahar na nikalay */}
                        <div className="aspect-square overflow-hidden">
                            <img
                                src={getMediaUrl(product?.gallery?.at(0)?.image)}
                                className="w-full h-full object-cover"
                                alt={product.title}
                            />
                        </div>
                        <h3 className="text-sm font-medium line-clamp-2 p-2">
                            {product?.title}
                        </h3>
                    </Link>
                })}
            </div>
            <FullWidthDivider className="-bottom-px" />
        </div>
    </section>
}