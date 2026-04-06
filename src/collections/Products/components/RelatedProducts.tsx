import { DecoratedBox } from "@/components/DecoratedBox"
import { ProductCard } from "@/components/ProductCard"
import { ProductSkeleton } from "@/components/ProductCard/ProductSkeleton"
import { Product } from "@/payload-types"
import { getProductById } from "@/utilities/getProduct"
import { Suspense } from "react"

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
                    {props?.products?.map(product => {
                        const productPromise = typeof product === 'number'
                            ? getProductById(product)
                            : product
                        const suspenseKey = typeof product === 'number' ? product : product.id
                        return (
                            <Suspense key={suspenseKey} fallback={<ProductSkeleton />}>
                                <ProductCard product={productPromise} />
                            </Suspense>
                        )
                    })}
                </div>
            </DecoratedBox>
        </section>
    )
}