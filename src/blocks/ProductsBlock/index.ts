import { Block } from "payload";

export const ProductsBlock: Block = {
    slug: 'products-blocks',
    interfaceName: 'ProductsPropsTypes',
    labels: {
        plural: 'Products',
        singular: 'Product'
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
                    name: 'enableSpecificProducts',
                    label: 'Enable Specific Products',
                    defaultValue: false,
                },
            ]
        },
        {
            type: 'relationship',
            relationTo: 'products',
            name: 'products',
            label: 'Select Items',
            hasMany: true,
            admin: {
                condition: (_, { enableSpecificProducts }) => Boolean(enableSpecificProducts),
                description: 'Select Which Products should show in this section.',
            }
        },
    ]
}