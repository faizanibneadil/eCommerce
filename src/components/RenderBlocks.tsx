import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Config, Page, Product, Variant } from '../payload-types'
import type { BlockSlug } from 'payload'
import { Carousel } from '@/blocks/CarouselBlock/Carousel'
import { Categories } from '@/blocks/CategoriesBlock/Categories'
import { Products } from '@/blocks/ProductsBlock/Products'
import { FAQs } from '@/blocks/FAQs/FAQs'
import { ContentBlock } from '@/blocks/ContentBlock/ContentBlock'


const blocksMap: Record<BlockSlug, React.ComponentType<any>> = {
    "carousel-block": Carousel,
    "categories-blocks": Categories,
    "products-blocks": Products,
    faqsBlock: FAQs,
    contentBlock: ContentBlock
}

export const RenderBlocks: React.FC<{
    blocks: Config['blocks'][keyof Config['blocks']][] | null | undefined
}> = (props) => {
    const { blocks } = props

    const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

    if (hasBlocks) {
        return (
            <div className='space-y-2'>
                {blocks.map((block, index) => {
                    const { blockName, blockType } = block

                    if (blockType && blockType in blocksMap) {
                        const Block = blocksMap[blockType]

                        if (Block) {
                            return (
                                <div key={index}>
                                    {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                                    {/* @ts-ignore - weird type mismatch here */}
                                    <Block id={toKebabCase(blockName!)} {...block} />
                                </div>
                            )
                        }
                    }
                    return null
                })}
            </div>
        )
    }

    return null
}
