'use client'
import * as React from "react";
import { cn } from "@/lib/utils";
import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { CarouselPropsTypes } from "@/payload-types";
import { getMediaUrl } from "@/utilities/getURL";
import Image from "next/image";
import { CMSImage } from "@/components/ui/CMSImage";
import { getMedia } from "@/utilities/getMedia";
import { getShimmerDataUrl } from "@/utilities/getShimmerEffect";

export function CarouselClient(props: CarouselPropsTypes) {
    const [api, setApi] = React.useState<CarouselApi>();
    const [current, setCurrent] = React.useState(0);

    React.useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const handleThumbClick = React.useCallback(
        (index: number) => {
            api?.scrollTo(index);
        },
        [api]
    );

    return (
        <div className="mx-auto w-full">
            <Carousel className="w-full" setApi={setApi}>
                <CarouselContent>
                    {props?.slides?.map((slide, idx) => {
                        const media = slide.type === 'external'
                            ? slide.url && slide.url
                            : slide.image
                        return (
                            <CarouselItem key={`${slide.id}.${idx}`} className="h-98">
                                {typeof media === 'string' ? (
                                    <Image
                                        src={media as string}
                                        className="size-full object-cover overflow-hidden"
                                        alt={'Slide'}
                                        fetchPriority="high"
                                        loading="eager"
                                        height={40}
                                        width={200}
                                    />
                                ) : (
                                    <React.Suspense fallback='loading image'>
                                        <CMSImage
                                            className="size-full object-cover overflow-hidden"
                                            height={40}
                                            width={200}
                                            alt='Main Slide Image'
                                            src={typeof media === 'number' ? getMedia(media) : media}
                                        />
                                    </React.Suspense>
                                )}
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>

            <Carousel className="mt-1 w-full">
                {/* <div className="mask-x-from-90%"> */}
                <CarouselContent className="grid grid-cols-8 gap-1">
                    {props?.slides?.map((slide, idx) => {
                        const imgSrc = slide.type === 'external'
                            ? slide.url && slide.url
                            : getMediaUrl(slide.image)
                        return (
                            <CarouselItem
                                className={cn(
                                    "aspect-square cursor-pointer pl-0",
                                    // current === idx + 1 ? "opacity-100" : "opacity-50"
                                )}
                                key={idx}
                                onClick={() => handleThumbClick(idx)}
                            >
                                {typeof slide.image === 'string' ? (
                                    <Image
                                        // placeholder="blur"
                                        // blurDataURL={slide.type === 'external' ? undefined : getShimmerDataUrl()}
                                        src={imgSrc as string}
                                        className="size-full object-cover overflow-hidden"
                                        alt={'Slide'}
                                        fetchPriority="high"
                                        loading="eager"
                                        height={40}
                                        width={200}
                                    />
                                ) : (
                                    <React.Suspense fallback='loading image'>
                                        <CMSImage
                                            className="size-full object-cover overflow-hidden"
                                            height={40}
                                            width={200}
                                            alt='Main Slide Image'
                                            src={typeof slide.image === 'number' ? getMedia(slide.image) : slide.image}
                                        />
                                    </React.Suspense>
                                )}
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                {/* </div> */}
                <CarouselPrevious className='left-2' />
                <CarouselNext className='right-2' />
            </Carousel>
        </div>
    );

}