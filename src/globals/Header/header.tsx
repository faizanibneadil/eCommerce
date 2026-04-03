import { getCachedGlobal } from "@/utilities/getGlobals"
import { HeaderClient } from "./header.client"

export const Header: React.FC = async () => {
    const headerConfig = await getCachedGlobal('header', 2)()
    const settingsConfig = await getCachedGlobal('settings', 1)()
    return <HeaderClient headerConfig={headerConfig} settingsConfig={settingsConfig} />
}