import type { GlobalConfig } from 'payload'

import { adminOnly } from '@/access/adminOnly'

export const Header: GlobalConfig = {
    slug: 'header',
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