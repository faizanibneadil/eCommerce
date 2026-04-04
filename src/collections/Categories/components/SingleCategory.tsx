import { DecoratedBox } from "@/components/DecoratedBox"
import { DataFromCollectionSlug } from "payload"
import { CategoryProducts } from "./CategoryProducts"

export const SingleCategory: React.FC<DataFromCollectionSlug<'categories'>> = (props: DataFromCollectionSlug<'categories'>) => {
    return (
        <DecoratedBox>
            <CategoryProducts products={props.products} />
        </DecoratedBox>
    )
}