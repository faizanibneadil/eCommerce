import { Media } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { CollectionBeforeChangeHook } from "payload";
import sharp from "sharp";
import { thumbHashToDataURL, rgbaToThumbHash } from 'thumbhash';

export const populateBlurDataURL: CollectionBeforeChangeHook<Media> = async ({
    data,
    req,
    operation,
    originalDoc
}) => {
    try {
        let buffer: Buffer | null = null;

        // 1. Check karein file kahan se leni hai
        if (req.file?.data) {
            // Nayi upload hone wali file
            buffer = req.file.data;
        } else if (operation === 'update' && !data?.blurDataUrl) {
            // Agar cloud pr update ho raha hai to URL se fetch karein
            const image = data || originalDoc;
            if (image) {
                const response = await fetch(new URL(`${getServerSideURL()}/api/media/file/${image?.filename}`).toString());
                if (response.ok) {
                    const arrayBuffer = await response.arrayBuffer();
                    buffer = Buffer.from(arrayBuffer);
                }
            }
        }

        // 2. ThumbHash generate karein
        if (buffer && !data?.blurDataUrl) {
            console.log({ process: 'start' });

            /**
             * SAHI ORDER:
             * 1. sharp(buffer) -> Image load karein
             * 2. resize() -> Chota karein (Performance ke liye)
             * 3. ensureAlpha() -> RGBA format lazmi karein
             * 4. raw() -> Image ko binary pixels mein badlein (Iske baad koi format change nahi karna)
             * 5. toBuffer() -> Pixels ka buffer nikal lein
             */
            const { data: pixels, info } = await sharp(buffer)
                .resize(100, 100, { fit: 'inside' }) // 20x20 bohat chota hai, 100 behtar hai
                .ensureAlpha()
                .raw()
                .toBuffer({ resolveWithObject: true });

            console.log({ process: 'pixels ready' });

            // Ab 'pixels' hamesha raw data hoga jo thumbhash ko chahiye
            const thumbHash = rgbaToThumbHash(info.width, info.height, pixels);

            console.log({ process: 'thumbhash done' });

            // data.blurDataUrl ko assign karein
            if (data) {
                data.blurDataUrl = thumbHashToDataURL(thumbHash);
                console.log({ process: 'assigned done' });
            }
        }

        return data;

    } catch (error) {
        console.error("Error in populateBlurDataURL:", error);
        return data;
    }
}