import { CMSImage } from "@/components/ui/CMSImage"
import { getCachedGlobal } from "@/utilities/getGlobals"
import { getMedia } from "@/utilities/getMedia"

export const Logo: React.FC = async () => {
    const settings = await getCachedGlobal('settings')()
    const imageSrc = typeof settings.adminLogo === 'number' ? await getMedia(settings.adminLogo) : settings.adminLogo
    return <CMSImage src={imageSrc} alt='Logo' className='h-20' />
}