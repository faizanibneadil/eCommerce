import type { DataFromCollectionSlug } from "payload"

import { DecoratedBox } from "@/components/DecoratedBox"
import { ProductDetails } from "./ProductDetails"
import { ProductGallery } from "./ProductGalley"
import { RelatedProducts } from "./RelatedProducts"
import { RenderBlocks } from "@/components/RenderBlocks"
import { SizeGuide } from "./SizeGuide"
import { queryBlocksFromBlocksById } from "@/utilities/queryBlocksFromBlocksById"

export const SingleProduct: React.FC<DataFromCollectionSlug<'products'>> = async (props: DataFromCollectionSlug<'products'>) => {
    const blocks = props.enableBlockFromBlock
        ? typeof props?.enabledBlocks === 'number'
            ? await queryBlocksFromBlocksById({ id: props?.enabledBlocks })
            : props.enabledBlocks?.blocks
        : props.layout
    return (
        <>
            <DecoratedBox>
                <div className="grid grid-cols-12 gap-2">
                    <div className="col-span-12 md:col-span-4">
                        <ProductGallery product={props} />
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <ProductDetails product={props} />
                    </div>
                </div>
            </DecoratedBox>
            <SizeGuide sizesGuides={props.sizeGuide} />
            <RenderBlocks blocks={blocks} />
            <RelatedProducts products={props.relatedProducts} />
        </>
    )
}