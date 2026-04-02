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
            type: 'relationship',
            relationTo: 'menus',
            name: 'mainMenu',
            label: 'Main Menu'
        },
    ],
}