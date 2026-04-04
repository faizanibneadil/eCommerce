"use client"

import {
    CreditCardIcon,
    LogOutIcon,
    MapPin,
    Pin,
    SettingsIcon,
    ShoppingBasket,
    User,
    UserIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='cursor-pointer' render={<Button variant="outline" size="icon-sm"><User /></Button>} />
            <DropdownMenuContent>
                <DropdownMenuItem className='cursor-pointer' render={<Link href='/account' />} nativeButton={false}>
                    <UserIcon />
                    Account
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' render={<Link href='/orders' />} nativeButton={false}>
                    <ShoppingBasket />
                    Orders
                </DropdownMenuItem>
                <DropdownMenuItem className='cursor-pointer' render={<Link href='/addresses' />} nativeButton={false}>
                    <MapPin />
                    Addresses
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' variant="destructive" render={<Link href='/logout' />} nativeButton={false}>
                    <LogOutIcon />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
