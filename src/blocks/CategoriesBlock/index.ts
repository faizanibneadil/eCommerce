import { Block } from "payload";

export const CategoriesBlock: Block = {
    slug: 'categories-blocks',
    labels: {
        plural: 'Categories',
        singular: 'Category'
    },
    fields: [
        {
            type: 'text',
            name: 'label',
            label: 'Label'
        },
        {
            type: 'row',
            fields: [
                {
                    type: 'checkbox',
                    name: 'enableSlides',
                    label: 'Enable Slides',
                    defaultValue: true,
                },
                {
                    type: 'checkbox',
                    name: 'enableSpecificCategories',
                    label: 'Enable Specific Categories',
                    defaultValue: false,
                },
            ]
        },
        {
            type: 'relationship',
            relationTo: 'categories',
            name: 'categories',
            label: 'Select Items',
            hasMany: true,
            admin: {
                condition: (_, { enableSpecificCategories }) => Boolean(enableSpecificCategories),
                description: 'Select Which Categories should show in this section.',
            }
        },
    ]
}