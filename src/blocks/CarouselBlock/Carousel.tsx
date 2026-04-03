import { CarouselPropsTypes } from "@/payload-types";
import { CarouselClient } from "./Carousel.client";

export function Carousel(props: CarouselPropsTypes) {
    return <CarouselClient {...props} />
}