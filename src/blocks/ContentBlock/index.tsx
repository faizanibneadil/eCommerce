import type { Block, Field } from 'payload'

import {
    FixedToolbarFeature,
    HeadingFeature,
    InlineToolbarFeature,
    lexicalEditor,
    LinkFeature,
} from '@payloadcms/richtext-lexical'

export const ContentBlock: Block = {
    slug: 'contentBlock',
    interfaceName: 'ContentBlockPropsType',
    fields: [
        {
            name: 'richText',
            type: 'richText',
            editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                    return [
                        ...rootFeatures,
                        HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                        FixedToolbarFeature(),
                        InlineToolbarFeature(),
                        LinkFeature({
                            enabledCollections: ['pages', 'products', 'categories'],
                        })
                    ]
                },
            }),
            label: false,
        },
    ],
}
