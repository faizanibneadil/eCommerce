'use client'
import { DecoratedBox } from "@/components/DecoratedBox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { TSizeGuidePropsType } from "@/payload-types";
import { ChevronsUpDown } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { DefaultDocumentIDType } from "payload";

export const SizeGuide: React.FC<{ sizesGuides: TSizeGuidePropsType | undefined }> = ({
    sizesGuides
}) => {
    const searchParams = useSearchParams()
    const values = Array.from(searchParams.values())

    const idx = sizesGuides?.findIndex(item => {
        if (!item.variantOption) {
            return false
        }

        let variantID: DefaultDocumentIDType
        if (typeof item.variantOption === 'object') {
            variantID = item?.variantOption?.id
        } else {
            variantID = item.variantOption
        }

        return Boolean(values.find(value => value === String(variantID)))
    }) ?? -1

    if (idx === -1 && !sizesGuides?.at(idx)) {
        return null
    }

    return (
        <DecoratedBox dividerTop={false}>
            <div className=''>
                <Collapsible className="flex w-full flex-col gap-2">
                    <CollapsibleTrigger className="flex items-center justify-between gap-4 p-4">
                        <h4 className="text-sm font-semibold">Size Guide</h4>
                        <ChevronsUpDown className="size-4" />
                        <span className="sr-only">Toggle details</span>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Table>
                            <TableBody>
                                {sizesGuides?.at(idx)?.guide?.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell className='px-4'>
                                            {item.label}
                                        </TableCell>
                                        <TableCell className='px-4'>
                                            {item.value}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CollapsibleContent>
                </Collapsible>
            </div>
        </DecoratedBox>
    )
}