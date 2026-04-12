import { CollectionConfig } from "payload";

export const Blocks: CollectionConfig<'blocks'> = {
    slug: 'blocks',
    admin: {
        useAsTitle: 'title'
    },
    trash: true,
    access: {
        read: () => true
    },
    defaultPopulate: {
        blocks: true
    },
    fields: [
        {
            type: 'text',
            name: 'title',
            required: true
        },
        {
            type: 'blocks',
            name: 'blocks',
            blocks: [],
            blockReferences: [
                'carousel-block',
                'categories-blocks',
                'faqsBlock',
                'products-blocks',
                'contentBlock'
            ]
        }
    ],
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 50,
    },
}