import { getCachedGlobal } from "@/utilities/getGlobals"
import { HeaderClient } from "./header.client"
import { getMedia } from "@/utilities/getMedia"

export const Header: React.FC = async () => {
    const headerConfig = await getCachedGlobal('header', 2)()
    const settingsConfig = await getCachedGlobal('settings', 1)()
    const logoSrc = typeof settingsConfig?.lightLogo === 'number'
        ? await getMedia(settingsConfig?.lightLogo)
        : settingsConfig?.lightLogo!
    return <HeaderClient headerConfig={headerConfig} settingsConfig={settingsConfig} logoSrc={logoSrc} />
}