import { GlobalConfig } from "payload";

export const Settings: GlobalConfig<'settings'> = {
    slug: 'settings',
    fields: [
        {
            type: 'text',
            name: 'brand',
            label: 'Brand Label'
        },
        {
            type: 'text',
            name: 'slogan',
            label: 'Brand Slogan'
        },
        {
            type: 'row',
            fields: [
                {
                    type: 'upload',
                    relationTo: 'media',
                    name: 'darkLogo',
                    label: 'Dark Logo',
                    admin: {
                        description: 'The logo will visible on dark theme'
                    }
                },
                {
                    type: 'upload',
                    relationTo: 'media',
                    name: 'lightLogo',
                    label: 'light Logo',
                    admin: {
                        description: 'The logo will visible on light theme'
                    }
                }
            ]
        },
        {
            type: 'row',
            fields: [
                {
                    type: 'upload',
                    relationTo: 'media',
                    name: 'og',
                    label: 'Open Graph Image',
                    admin: {
                        description: 'The Open Graph Image.'
                    }
                },
                {
                    type: 'upload',
                    relationTo: 'media',
                    name: 'favicon',
                    label: 'Favicon',
                    admin: {
                        description: 'The Favicon.'
                    }
                }
            ]
        },
    ]
}