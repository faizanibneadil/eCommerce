import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from '@payloadcms/plugin-seo/fields'


export const Categories: CollectionConfig = {
    slug: 'categories',
    access: {
        create: adminOnly,
        delete: adminOnly,
        read: () => true,
        update: adminOnly,
    },
    admin: {
        useAsTitle: 'title',
        group: 'Content',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Content',
                    fields: [
                        {
                            type: 'upload',
                            relationTo: 'media',
                            name: 'image',
                            label: 'Category image'
                        },
                        {
                            type: 'join',
                            collection: 'products',
                            name: 'products',
                            on: 'categories',
                            admin: {
                                description: 'Related Products.',
                                disableBulkEdit: undefined,
                                allowCreate: false,
                                disableRowTypes: true,
                                disableGroupBy: true,
                                disableListFilter: true,
                                disableListColumn: true,
                            }
                        },
                    ]
                },
                {
                    label: 'SEO',
                    name: 'meta',
                    fields: [
                        OverviewField({
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                        }),
                        MetaTitleField({
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            relationTo: 'media',
                        }),

                        MetaDescriptionField({}),
                        PreviewField({
                            // if the `generateUrl` function is configured
                            hasGenerateFn: true,

                            // field paths to match the target field for data
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                        }),
                    ]
                }
            ]
        },
        slugField({
            position: undefined,
        }),
    ],
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 50,
    },
}