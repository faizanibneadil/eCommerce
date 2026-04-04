import { DecoratedBox } from "@/components/DecoratedBox"
import { Product } from "@/payload-types"
import { getMediaUrl } from "@/utilities/getURL"
import Link from "next/link"

export const RelatedProducts: React.FC<{
    products: Product['relatedProducts']
}> = (props) => {
    return (
        <section>
            <h2 className="py-6 text-center font-medium text-lg text-muted-foreground tracking-tight md:text-xl">
                Related Products
            </h2>
            <DecoratedBox>
                <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
                    {props?.products?.map(product => typeof product === 'number' ? null : (
                        <Link href={`/products/${product.slug}`} key={product.id} className="flex flex-col ">
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
                    ))}
                </div>
            </DecoratedBox>
        </section>
    )
}