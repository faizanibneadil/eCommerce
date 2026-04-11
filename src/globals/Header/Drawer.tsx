'use client';
import { Button } from "@/components/ui/button";
import { Drawer } from '@base-ui/react/drawer';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { useAuth } from "@/providers/Auth";
import { UserIcon, X } from 'lucide-react';
import Link from "next/link";
import React, { useState } from "react";

const ITEMS = [
    { href: '/account', label: 'Account' },
    { href: '/addresses', label: 'Addresses' },
    { href: '/orders', label: 'Orders' },
] as const;

export default function UserMenuDrawer() {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    if (!user) {
        return (
            <Button className='rounded-full cursor-pointer' variant='secondary' size="icon-lg" nativeButton={false} render={<Link href='/login' />}>
                <UserIcon className="size-4.5" />
            </Button>
        );
    }

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger render={
                <Button onClick={() => setOpen(true)} className='cursor-pointer rounded-full' variant="outline" size="icon-lg">
                    <UserIcon className="size-4.5" />
                </Button>
            } />

            <Drawer.Portal>
                <Drawer.Backdrop className="z-10 fixed inset-0 min-h-dvh bg-black/10 opacity-(--backdrop-opacity) transition-opacity duration-600 ease-(--ease-out-fast) backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0" />

                {/* Viewport: Hamesha flex-col taake bottom sheet behavior rahe */}
                <Drawer.Viewport className="group fixed inset-0 z-12 flex flex-col items-center justify-end">
                    <ScrollArea.Root
                        style={{ position: undefined }}
                        className="box-border w-full max-w-2xl overscroll-contain transition-transform duration-600 ease-(--ease-out-fast) 
                                   group-data-starting-style:translate-y-full 
                                   group-data-ending-style:pointer-events-none"
                    >
                        <ScrollArea.Viewport className="box-border overscroll-contain touch-auto max-h-dvh">
                            {/* Items-end aur justify-center se hamesha bottom center align rahega */}
                            <ScrollArea.Content className="flex min-h-full items-end justify-center pt-8">
                                <Drawer.Popup className="group box-border w-full outline-none transition-transform duration-800 ease-(--ease-out-fast) 
                                                       data-ending-style:translate-y-full">

                                    {/* Rounded-t corners hamesha rahen ge */}
                                    <div className="relative flex flex-col rounded-t-2xl bg-gray-50 text-gray-900 shadow-xl outline-1 outline-gray-200 pb-2">

                                        {/* Drag handle aur close area */}
                                        <div className="px-6 pt-4 pb-2">
                                            <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center">
                                                <div aria-hidden className="h-9 w-9" />
                                                <div className="h-1 w-12 justify-self-center rounded-full bg-gray-300" />
                                                <Drawer.Close className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <X className="size-4" />
                                                </Drawer.Close>
                                            </div>
                                            <Drawer.Title className="m-0 mb-1 text-lg font-semibold">{user?.name || user?.email}</Drawer.Title>
                                            <Drawer.Description className="m-0 mb-4 text-sm text-gray-500">
                                                Manage your account settings.
                                            </Drawer.Description>
                                        </div>

                                        {/* Menu Links */}
                                        <div className="px-6 py-2 flex flex-col gap-2">
                                            {ITEMS?.map(link => (
                                                <Button
                                                    className='w-full h-11 justify-start px-4 text-base font-normal'
                                                    variant='secondary'
                                                    key={link.href}
                                                    render={<Link href={link.href} onClick={() => setOpen(false)} />}
                                                    nativeButton={false}
                                                >
                                                    {link.label}
                                                </Button>
                                            ))}
                                        </div>

                                        {/* Footer / Logout */}
                                        <div className="p-6 mt-2 border-t border-gray-100 bg-white/50">
                                            <Button
                                                className='w-full h-11'
                                                variant='destructive'
                                                onClick={() => {
                                                    logout?.();
                                                    setOpen(false);
                                                }}
                                            >
                                                Logout
                                            </Button>
                                        </div>
                                    </div>
                                </Drawer.Popup>
                            </ScrollArea.Content>
                        </ScrollArea.Viewport>
                    </ScrollArea.Root>
                </Drawer.Viewport>
            </Drawer.Portal>
        </Drawer.Root>
    );
}