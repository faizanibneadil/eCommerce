'use client'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/payload-types";
import { getMedia } from "@/utilities/getMedia";
import Link from "next/link";
import * as React from "react";
import { CMSImage } from "../ui/CMSImage";
import { cn } from "@/lib/utils";

export const ProductCard: React.FC<{
    product: Product | Promise<Product>,
    enableTitle?: boolean,
    enableSlideAsVariantSwitch?: boolean,
    enableSlideThumb?: boolean,
    enableCarousel?: boolean
}> = ({
    product: productFromProps,
    enableTitle = true,
    enableSlideAsVariantSwitch = false,
    enableSlideThumb = false,
    enableCarousel = false
}) => {
        const product = productFromProps instanceof Promise ? React.use(productFromProps) : productFromProps

        const [slidesApi, setSlidesApi] = React.useState<CarouselApi>()
        const [thumbApi, setThumbApi] = React.useState<CarouselApi>()
        const [current, setCurrent] = React.useState(0)
        const [count, setCount] = React.useState(0)

        React.useEffect(() => {
            if (!slidesApi) {
                return
            }
            setCount(slidesApi.scrollSnapList().length)
            setCurrent(slidesApi.selectedScrollSnap() + 1)

            slidesApi.on("select", () => {
                setCurrent(slidesApi.selectedScrollSnap() + 1)
            })
        }, [slidesApi])

        const onSlideChange = (idx: number) => {
            slidesApi?.scrollTo(idx)
            thumbApi?.scrollTo(idx)
        }

        const media = product?.gallery?.at(0)
        const mediaSrc = typeof media?.image === 'number' ? getMedia(media?.image!) : media?.image

        return (
            <div className="flex flex-col  md:max-w-xs">
                {enableCarousel ? (<div className="">
                    <Carousel className="w-full group" setApi={setSlidesApi} opts={{ loop: true }}>
                        <CarouselContent className="md:aspect-square">
                            {product?.gallery?.map((media, index) => {
                                const alt = product?.title
                                const src = typeof media.image === 'number' ? getMedia(media.image) : media.image
                                return (
                                    <CarouselItem key={media.id} className="flex items-center justify-center">
                                        <React.Suspense fallback='loading image'>
                                            {enableSlideAsVariantSwitch ? (
                                                <CMSImage alt={alt} src={src} />
                                            ) : (
                                                <Link href={`/products/${product.slug}`}>
                                                    <CMSImage alt={alt} src={src} />
                                                </Link>
                                            )}
                                        </React.Suspense>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious className='left-1 hidden group-hover:flex items-center justify-center' />
                        <CarouselNext className='right-1  hidden group-hover:flex items-center justify-center' />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center justify-center gap-1 bg-white z-9 p-1 rounded-full">
                            {Array.from({ length: count }).map((_, index) => (
                                <button
                                    className={cn("h-0.5 w-0.5 rounded-full border-2", {
                                        "border-primary": current === index + 1,
                                    })}
                                    key={index}
                                    onClick={() => slidesApi?.scrollTo(index)}
                                />
                            ))}
                        </div>
                    </Carousel>
                </div>) : (
                    <React.Suspense fallback={null}>
                        <Link href={`/products/${product.slug}`}>
                            <CMSImage alt={product?.title} src={mediaSrc!} />
                        </Link>
                    </React.Suspense>
                )}
                {enableSlideThumb && (
                    <Carousel className="w-full group" setApi={setThumbApi} opts={{ align: 'center', containScroll: 'keepSnaps' }}>
                        <CarouselContent className="mt-2">
                            {product?.gallery?.map((media, idx) => {
                                const alt = product?.title
                                const src = typeof media.image === 'number' ? getMedia(media.image) : media.image
                                return (
                                    <CarouselItem onClick={() => onSlideChange(idx)} key={media.id} className="basis-1/4 cursor-pointer transition-opacity">
                                        <React.Suspense fallback='loading image'>
                                            <CMSImage alt={alt} src={src} className="aspect-square object-cover" />
                                        </React.Suspense>
                                    </CarouselItem>
                                )
                            })}
                        </CarouselContent>
                    </Carousel>
                )}
                {enableTitle && (<Link href={`/products/${product?.slug}`} className="text-sm font-medium line-clamp-2 p-2">
                    {product?.title}
                </Link>)}
            </div>
        )
    }