import { RichText, } from '@payloadcms/richtext-lexical/react'
import { hasText } from '@payloadcms/richtext-lexical/shared'
import type { ContentBlockPropsType } from '@/payload-types'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

export const ContentBlock: React.FC<ContentBlockPropsType> = (props) => {

    if (!hasText(props.richText)) {
        return null
    }

    return <RichText
        data={props.richText as DefaultTypedEditorState}
        className='payload-richtext w-full mb-5 mx-auto prose md:prose-md dark:prose-invert'
        disableContainer={true} />
}
