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
                        const imgSrc = slide.type === 'external'
                            ? slide.url && slide.url
                            : getMediaUrl(slide.image)
                        return (
                            <CarouselItem key={`${imgSrc}.${idx}`} className="h-98">
                                <img
                                    alt="dddepth-248"
                                    className="size-full object-cover"
                                    src={imgSrc as string}
                                />
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
                                <img
                                    alt="dddepth-248"
                                    className="size-full object-cover"
                                    src={imgSrc as string}
                                />
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
                {/* </div> */}
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );

}