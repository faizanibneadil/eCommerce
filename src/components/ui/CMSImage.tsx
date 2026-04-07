'use client'

import { Media } from "@/payload-types"
import { cssVariables } from '@/utilities/cssVariables'
import { getShimmerDataUrl } from "@/utilities/getShimmerEffect"
import { getMediaUrl } from "@/utilities/getURL"
import Image, { ImageProps } from "next/image"
import { use } from "react"

const { breakpoints } = cssVariables

type Props = Omit<ImageProps, 'src'> & { src: Media | Promise<Media> | null | undefined }
export const CMSImage: React.FC<Props> = (props) => {
    // const [loaded, setLoading] = useState(false)

    if (!props.src) {
        return null
    }

    const media = props.src instanceof Promise ? use(props.src) : props.src

    const _width = !props.fill ? props.width ?? media?.width! : undefined
    const _height = !props.fill ? props.height ?? media?.height! : undefined
    const _sizes = props.sizes
        ? props.sizes
        : Object.entries(breakpoints)
            .map(([, value]) => `(max-width: ${value}px) ${value * 2}w`)
            .join(', ')

    return <Image
        loading='lazy'
        width={_width}
        height={_height}
        placeholder='blur'
        sizes={_sizes}
        blurDataURL={getShimmerDataUrl(_width, _height)}
        // onLoad={() => setLoading(true)}
        // style={{
        //     filter: loaded ? 'blur(0px)' : 'blur(1px)',
        //     transition: loaded ? `filter 500ms ease-in-out` : undefined,
        //     // objectFit: 'cover',
        //     // objectPosition: 'center',
        // }}
        {...props}
        // className={cn('object-center object-cover', props.className)}
        src={getMediaUrl(media)}
    />
}