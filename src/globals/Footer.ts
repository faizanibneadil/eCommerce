import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { link } from '@/fields/link'

export const Footer: GlobalConfig = {
    slug: 'footer',
    access: {
        read: () => true,
        update: adminOnly,
    },
    fields: [
        {
            name: 'navItems',
            type: 'array',
            fields: [
                {
                    type: 'row',
                    fields: [
                        {
                            name: 'type',
                            type: 'radio',
                            admin: {
                                layout: 'horizontal',
                                width: '50%',
                            },
                            defaultValue: 'internal',
                            options: [
                                {
                                    label: 'Internal link',
                                    value: 'internal',
                                },
                                {
                                    label: 'External URL',
                                    value: 'external',
                                },
                            ],
                        },
                        {
                            name: 'newTab',
                            type: 'checkbox',
                            admin: {
                                style: {
                                    alignSelf: 'flex-end',
                                },
                                width: '50%',
                            },
                            label: 'Open in new tab',
                        },
                    ],
                },
                {
                    type: 'row',
                    fields: [
                        {
                            type: 'relationship',
                            relationTo: ['pages'],
                            name: 'page',
                            label: 'Page',
                            admin: {
                                condition: (_, { type }) => type === 'internal',
                                width: '50%'
                            }
                        },
                        {
                            type: 'text',
                            name: 'url',
                            label: 'URL',
                            validate: (url: string | undefined | null) => {
                                try {
                                    if (!url) {
                                        return 'URL is required.'
                                    }
                                    new URL(url)
                                    return true
                                } catch (error) {
                                    return 'Invalid URL'
                                }
                            },
                            admin: {
                                condition: (_, { type }) => type === 'external',
                                width: '50%'
                            }
                        },
                        {
                            type: 'text',
                            name: 'label',
                            label: 'Label',
                            admin: {
                                width: '50%'
                            }
                        }
                    ]
                }
            ],
        },
    ],
}