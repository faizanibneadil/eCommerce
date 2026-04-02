import type { CollectionConfig } from 'payload'

import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { adminOnly } from '@/access/adminOnly'
import { slugField } from 'payload'
import { adminOrPublishedStatus } from '@/access/adminOrPublishedStatus'
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { revalidatePage, revalidateDelete } from './hooks/revalidatePage'

export const Pages: CollectionConfig = {
    slug: 'pages',
    access: {
        create: adminOnly,
        delete: adminOnly,
        read: adminOrPublishedStatus,
        update: adminOnly,
    },
    admin: {
        group: 'Content',
        defaultColumns: ['title', 'slug', 'updatedAt'],
        livePreview: {
            url: ({ data, req }) =>
                generatePreviewPath({
                    slug: data?.slug,
                    collection: 'pages',
                    req,
                }),
        },
        preview: (data, { req }) =>
            generatePreviewPath({
                slug: data?.slug as string,
                collection: 'pages',
                req,
            }),
        useAsTitle: 'title',
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            type: 'checkbox',
            name: 'enableCollection',
            label: 'Enable Collection',
            admin: {
                position: 'sidebar',
                description: 'If you want to show your collections like: Products, Categories etc then you have to change collection.',
            },
            required: true,
            defaultValue: false
        },
        {
            type: 'tabs',
            tabs: [
                {
                    fields: [
                        {
                            type: 'text',
                            name: 'configuredCollectionSlug',
                            admin: {
                                condition: ({ enableCollection }) => Boolean(enableCollection) === true,
                                components: {
                                    Field: {
                                        path: '@/collections/Pages/components/ConfiguredCollectionSlug.tsx',
                                        exportName: 'ConfiguredCollectionSlug',
                                        clientProps: {
                                            options: [
                                                { label: 'Categories', value: 'categories' },
                                                { label: 'Products', value: 'products' }
                                            ]
                                        }
                                    }
                                },
                            },
                        },
                        {
                            type: 'blocks',
                            name: 'layout',
                            label: 'Design You\'r Page',
                            blocks: [],
                            maxRows: 50,
                            blockReferences: ['products-blocks', 'categories-blocks', 'carousel-block'],
                            admin: {
                                initCollapsed: true,
                                condition: ({ enableCollection }) => Boolean(enableCollection) === false,
                            }
                        },
                    ],
                    label: 'Content',
                },
                {
                    name: 'meta',
                    label: 'SEO',
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
                    ],
                },
            ],
        },
        slugField(),
    ],
    hooks: {
        afterChange: [revalidatePage],
        afterDelete: [revalidateDelete],
    },
    versions: {
        drafts: {
            autosave: true,
        },
        maxPerDoc: 50,
    },
}