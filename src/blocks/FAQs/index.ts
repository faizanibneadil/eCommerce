import { Block } from "payload";

export const FAQsBlock: Block = {
    slug: 'faqsBlock',
    interfaceName: 'TFAQsBlockPropsType',
    fields: [
        {
            type: 'text',
            name: 'heading',
            label: 'Section Heading',
            defaultValue: 'FAQs'
        },
        {
            type: 'textarea',
            name: 'description',
            label: 'Section Description',
            defaultValue: 'Here are some common questions and answers that you might encounter when using Efferd.'
        },
        {
            type: 'array',
            name: 'faqs',
            minRows: 1,
            fields: [
                {
                    type: 'text',
                    name: 'question',
                    label: 'Question'
                },
                {
                    type: 'textarea',
                    name: 'answer',
                    label: 'Answer'
                }
            ]
        }
    ],
    labels: {
        plural: 'FAQs',
        singular: 'FAQ'
    },
}