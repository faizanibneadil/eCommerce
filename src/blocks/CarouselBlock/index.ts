import { Block } from "payload";

export const CarouselBlock: Block = {
    slug: 'carousel-block',
    interfaceName: 'CarouselPropsTypes',
    fields: [
        {
            type: 'array',
            name: 'slides',
            fields: [
                {
                    type: 'radio',
                    name: 'type',
                    defaultValue: 'internal',
                    options: [
                        { label: 'Internal', value: 'internal' },
                        { label: 'External', value: 'external' },
                    ]
                },
                {
                    type: 'text',
                    name: 'url',
                    validate: (url: string | null | undefined) => {
                        try {

                            if (!url) {
                                return 'URL Required.'
                            }

                            new URL(url)
                            return true
                        } catch (error) {
                            return 'Invalid URL'
                        }
                    },
                    admin: {
                        condition: (_, { type }) => type === 'external'
                    }
                },
                {
                    type: 'upload',
                    relationTo: 'media',
                    name: 'image',
                    admin: {
                        condition: (_, { type }) => type === 'internal'
                    }
                }
            ]
        }
    ]
}