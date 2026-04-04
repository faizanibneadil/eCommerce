'use client'
import { Product } from "@/payload-types"
import { getMediaUrl } from "@/utilities/getURL"
import { parseAsString, useQueryState } from 'nuqs'
import { motion, AnimatePresence } from 'motion/react'

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
            {/* <AnimatePresence> */}
            <img
                key={galleryId}
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                // transition={{ duration: 0.3, ease: 'easeInOut' }}
                src={getMediaUrl(imgSrc?.image)}
                className="w-full col-span-3"
            />
            {/* </AnimatePresence> */}
            {props?.gallery?.map(item => (
                <img src={getMediaUrl(item.image)} onClick={() => setGalleryId(item.id!)} key={item.id} className="w-full h-22 overflow-hidden object-cover cursor-pointer" />
            ))}
        </motion.div>
    )
}