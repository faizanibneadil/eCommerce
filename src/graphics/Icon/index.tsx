import { CMSImage } from "@/components/ui/CMSImage"
import { getCachedGlobal } from "@/utilities/getGlobals"
import { getMedia } from "@/utilities/getMedia"

export const Icon: React.FC = async () => {
    const settings = await getCachedGlobal('settings')()
    const imageSrc = typeof settings.adminIcon === 'number' ? await getMedia(settings.adminIcon) : settings.adminIcon
    return <CMSImage src={imageSrc} alt='Logo' />
}