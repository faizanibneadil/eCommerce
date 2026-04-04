import { DataFromCollectionSlug } from "payload"

import { DecoratedBox } from "@/components/DecoratedBox"
import { ProductDetails } from "./ProductDetails"
import { ProductGallery } from "./ProductGalley"
import { RelatedProducts } from "./RelatedProducts"

export const SingleProduct: React.FC<DataFromCollectionSlug<'products'>> = (props: DataFromCollectionSlug<'products'>) => {
    return (
        <>
            <DecoratedBox>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-4">
                        <ProductGallery gallery={props.gallery} />
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <ProductDetails product={props} />
                    </div>
                </div>
            </DecoratedBox>
            <RelatedProducts products={props.relatedProducts} />
        </>
    )
}