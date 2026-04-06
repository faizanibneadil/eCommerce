'use client'

import { cn } from "@/lib/utils"
import { Media } from "@/payload-types"
import { getBase64Blur, getMediaUrl } from "@/utilities/getURL"
import Image, { ImageProps } from "next/image"
import { use, useState } from "react"

type Props = Omit<ImageProps, 'src'> & { src: Media | Promise<Media> | null | undefined }
export const CMSImage: React.FC<Props> = (props) => {
    const [loaded, setLoading] = useState(false)

    if (!props.src) {
        return null
    }

    const media = props.src instanceof Promise ? use(props.src) : props.src

    return <Image
        property='lazy'
        loading='eager'
        width={!props.fill ? props.width ?? media?.width! : undefined}
        height={!props.fill ? props.height ?? media?.height! : undefined}
        placeholder='blur'
        blurDataURL={getBase64Blur(media)}
        onLoad={() => setLoading(true)}
        style={{
            filter: loaded ? 'blur(0px)' : 'blur(10px)',
            transition: loaded ? `filter 500ms ease-in-out` : undefined,
            // objectFit: 'cover',
            // objectPosition: 'center',
        }}
        {...props}
        // className={cn('object-center object-cover', props.className)}
        src={getMediaUrl(media)}
    />
}