import { slugField } from 'payload'
import type { CollectionConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

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