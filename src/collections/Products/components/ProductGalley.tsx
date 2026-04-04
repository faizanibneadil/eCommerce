'use client'
import { Product } from "@/payload-types"
import { getBase64Blur, getMediaUrl } from "@/utilities/getURL"
import { motion } from 'motion/react'
import Image from "next/image"
import { parseAsString, useQueryState } from 'nuqs'

export const ProductGallery: React.FC<{
    gallery: Product['gallery']
}> = (props) => {
    const [galleryId, setGalleryId] = useQueryState('img', parseAsString
        .withDefault(props.gallery?.at(0)?.id!)
        .withOptions({ history: 'replace', scroll: false, shallow: false }))

    const imgSrc = props.gallery?.find(item => {
        return item.id === galleryId
    })

    return (
        <motion.div className="grid grid-cols-3 gap-px" layout>
            <Image
                key={galleryId}
                placeholder="blur"
                blurDataURL={getBase64Blur(imgSrc?.image)}
                src={getMediaUrl(imgSrc?.image)}
                className="size-full object-cover overflow-hidden col-span-3"
                alt={'Slide'}
                fetchPriority="high"
                loading="lazy"
                height={40}
                width={200}
            />
            {props?.gallery?.map(item => (
                <Image
                    key={item?.id}
                    placeholder="blur"
                    blurDataURL={getBase64Blur(imgSrc?.image)}
                    src={getMediaUrl(item.image)}
                    className="w-full h-22 overflow-hidden object-cover cursor-pointer"
                    alt={'Slide'}
                    fetchPriority="high"
                    loading="lazy"
                    height={40}
                    width={200}
                    onClick={() => setGalleryId(item.id!)}
                />
            ))}
        </motion.div>
    )
}