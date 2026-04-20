import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { TFAQsBlockPropsType } from "@/payload-types";
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { RichText } from '@payloadcms/richtext-lexical/react'

export const FAQs: React.FC<TFAQsBlockPropsType> = (props) => {

    if (props?.faqs?.length === 0) {
        return null
    }


    return (
        <div>
            <div className="space-y-4 px-4 pt-12 pb-4">
                <h2 className="font-black text-3xl md:text-4xl">{props?.heading}</h2>
                <p className="text-muted-foreground">{props?.description}</p>
            </div>
            <Accordion defaultValue={[props?.faqs?.at(0)?.id]} className="rounded-none border-x-0 border-y">
                {props?.faqs?.map((item) => (
                    <AccordionItem className="px-4" key={item.id} value={item.id}>
                        <AccordionTrigger className="py-4 hover:no-underline focus-visible:underline focus-visible:ring-0">
                            {item?.question}
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-muted-foreground">
                            <RichText data={item?.answer as SerializedEditorState} className="prose-sm  prose md:prose-md dark:prose-invert" />
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    )
}