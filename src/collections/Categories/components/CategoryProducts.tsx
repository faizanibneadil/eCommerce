import { ProductCard } from "@/components/ProductCard"
import { ProductSkeleton } from "@/components/ProductCard/ProductSkeleton"
import { Category } from "@/payload-types"
import { getProductById } from "@/utilities/getProduct"
import { Suspense } from "react"

export const CategoryProducts: React.FC<{
    products: Category['products']
}> = (props) => {
    return (
        <div className="grid grid-cols-2 border md:grid-cols-4 gap-px">
            {props?.products?.docs?.map(product => {
                const productPromise = typeof product === 'number'
                    ? getProductById(product)
                    : getProductById(product.id)
                const suspenseKey = typeof product === 'number' ? product : product.id

                return (
                    <div key={suspenseKey} className="flex flex-col ">
                        <Suspense fallback={<ProductSkeleton />}>
                            <ProductCard product={productPromise} />
                        </Suspense>
                    </div>
                )

            })}
        </div>
    )
}