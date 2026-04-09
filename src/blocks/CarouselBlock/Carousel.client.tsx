'use client'
import { CMSImage } from "@/components/ui/CMSImage";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi
} from "@/components/ui/carousel";
import { CarouselPropsTypes } from "@/payload-types";
import { getMedia } from "@/utilities/getMedia";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import * as React from "react";

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
        <div className=" w-full">
            <Carousel className="w-full" setApi={setApi} plugins={[
                Autoplay({
                    delay: 2000,
                }),
            ]} opts={{
                loop: true
            }}>
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
        </div>
    );

}