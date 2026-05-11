import type { User, PayloadMcpApiKey } from '@/payload-types'

export const checkRole = (allRoles: User['roles'] = [], user?: User | PayloadMcpApiKey | null): boolean => {
    if (user?.collection === 'users' && allRoles) {
        return allRoles.some((role) => {
            return user?.roles?.some((individualRole) => {
                return individualRole === role
            })
        })
    }

    if (user?.collection === 'payload-mcp-api-keys' && allRoles) {
        return allRoles.some((role) => {
            return (user?.user as User)?.roles?.some((individualRole) => {
                return individualRole === role
            })
        })
    }

    return false
}