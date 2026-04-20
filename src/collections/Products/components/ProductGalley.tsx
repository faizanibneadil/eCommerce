'use client'
import { ProductCard } from "@/components/ProductCard"
import { Product } from "@/payload-types"

export const ProductGallery: React.FC<{
    product: Product
}> = (props) => {

    return <ProductCard
        product={props.product}
        enableSlideAsVariantSwitch={true}
        enableSlideThumb={true}
        enableTitle={false}
        enableCarousel={true}
    />

}