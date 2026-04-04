'use client'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { Button } from '@/components/ui/button'
import { Product, Variant } from '@/payload-types'
import { DecoratedBox } from '@/components/DecoratedBox'
import { useCurrency } from '@payloadcms/plugin-ecommerce/client/react'
import { Price } from './Price'
import { StockIndicator } from './StockIndicator'
import { Suspense } from 'react'
import { VariantSelector } from './VariantSelector'
import { AddToCart } from './AddToCart'

export const ProductDetails: React.FC<{
    product: Product,
}> = ({ product }) => {
    const { currency } = useCurrency()
    let amount = 0
    const priceField = `priceIn${currency.code}` as keyof Product
    const hasVariants = product.enableVariants && Boolean(product.variants?.docs?.length)

    if (hasVariants) {
        const priceField = `priceIn${currency.code}` as keyof Variant
        const variantsOrderedByPrice = product.variants?.docs as Variant[]
        amount = variantsOrderedByPrice[0][priceField] as number
    } else if (product[priceField] && typeof product[priceField] === 'number') {
        amount = product[priceField] as number
    }

    return (
        <>
            <h1 className="text-lg md:text-2xl font-medium p-2">{product?.title}</h1>
            {hasVariants && (
                <div className=''>
                    <DecoratedBox decoration={['top-right']} dividerBottom={false}>
                        <Suspense fallback={null}>
                            <VariantSelector product={product} />
                        </Suspense>
                    </DecoratedBox>
                </div>
            )}
            <DecoratedBox decoration={['bottom-right', 'top-right']}>
                <div className="flex gap-px items-center justify-between">
                    <Price amount={amount} />
                    <StockIndicator product={product} />
                    <Suspense fallback={null}>
                        <AddToCart product={product} />
                    </Suspense>
                </div>
            </DecoratedBox>
            <RichText data={product?.description as SerializedEditorState} className="prose-sm  prose md:prose-md dark:prose-invert p-2" />
        </>
    )
}