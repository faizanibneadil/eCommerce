import { toKebabCase } from '@/utilities/toKebabCase'
import React, { Fragment } from 'react'

import type { Page } from '../payload-types'
import { BlockSlug } from 'payload'
import { Carousel } from '@/blocks/CarouselBlock/Carousel'
import { Categories } from '@/blocks/CategoriesBlock/Categories'
import { Products } from '@/blocks/ProductsBlock/Products'


const blocksMap: Record<BlockSlug, React.ComponentType<any>> = {
    "carousel-block": Carousel,
    "categories-blocks": Categories,
    "products-blocks": Products
}

export const RenderBlocks: React.FC<{
    blocks: Page['layout'][][0]
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
