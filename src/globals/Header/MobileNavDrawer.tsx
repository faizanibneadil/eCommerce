'use client';
import { Button } from '@/components/ui/button';
import { Drawer } from '@base-ui/react/drawer';
import { ScrollArea } from '@base-ui/react/scroll-area';
import { MenuIcon } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export default function MobileNavDrawer(props: {
    menu: {
        label: string | null | undefined;
        href: string;
        newTabProps: {
            rel: string;
            target: string;
        } | {
            rel?: undefined;
            target?: undefined;
        };
    }[] | undefined
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <Drawer.Root open={open} onOpenChange={setOpen}>
            <Drawer.Trigger render={<Button onClick={() => setOpen(true)} className='rounded-full cursor-pointer' variant='secondary' size="icon-lg"><MenuIcon className="size-4.5" /></Button>} />
            <Drawer.Portal>
                <Drawer.Backdrop className="z-10 fixed inset-0 min-h-dvh bg-black/10 opacity-(--backdrop-opacity) transition-opacity duration-600 ease-(--ease-out-fast) backdrop-blur-xs data-starting-style:opacity-0 data-ending-style:opacity-0" />

                <Drawer.Viewport className="group fixed inset-0 z-12 flex flex-col md:flex-row">
                    <ScrollArea.Root
                        style={{ position: undefined }}
                        className="box-border h-full w-full overscroll-contain transition-transform duration-600 ease-(--ease-out-fast) 
                                   group-data-starting-style:translate-y-full md:group-data-starting-style:translate-y-0 md:group-data-starting-style:-translate-x-full 
                                   group-data-ending-style:pointer-events-none"
                    >
                        <ScrollArea.Viewport className="box-border h-full overscroll-contain touch-auto">
                            {/* md:h-dvh se screen height ensure hogi aur items-stretch se height inherit hogi */}
                            <ScrollArea.Content className="flex min-h-full items-end justify-center pt-8 md:min-h-dvh md:items-stretch md:justify-start md:p-0">
                                <Drawer.Popup className="group box-border w-full max-w-2xl outline-none transition-transform duration-800 ease-(--ease-out-fast) 
                                                       md:h-full md:max-w-sm md:flex
                                                       data-ending-style:translate-y-full md:data-ending-style:translate-y-0 md:data-ending-style:-translate-x-full">

                                    {/* md:h-full aur md:flex-1 dynamic height maintain karega */}
                                    <div className="relative flex flex-col rounded-t-2xl bg-gray-50 px-6 pt-4 pb-6 text-gray-900 shadow-xl outline-1 outline-gray-200 
                                                  md:flex-1 md:h-full md:rounded-none md:rounded-r-xl md:min-h-dvh">

                                        <div className="mb-3 grid grid-cols-[1fr_auto_1fr] items-center md:flex md:justify-between md:mb-6">
                                            <div aria-hidden className="h-9 w-9 md:hidden" />
                                            <div className="h-1 w-12 justify-self-center rounded-full bg-gray-300 md:hidden" />
                                            <Drawer.Title className="hidden md:block m-0 text-xl font-semibold tracking-tight">Menu</Drawer.Title>
                                            <Drawer.Close
                                                aria-label="Close menu"
                                                className="flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-gray-200 bg-gray-50 text-gray-900 hover:bg-gray-100 transition-colors"
                                            >
                                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                                    <path d="M0.75 0.75L6 6M11.25 11.25L6 6M6 6L0.75 11.25M6 6L11.25 0.75" stroke="currentcolor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </Drawer.Close>
                                        </div>

                                        <Drawer.Content className="w-full flex flex-col gap-1.5">
                                            <div className="md:hidden">
                                                <Drawer.Title className="m-0 mb-1 text-lg font-medium leading-7">Menu</Drawer.Title>
                                                <Drawer.Description className="m-0 mb-5 text-base text-gray-600">
                                                    Navigational links
                                                </Drawer.Description>
                                            </div>

                                            {props?.menu?.map((link) => (
                                                <Button
                                                    className='w-full h-11 justify-start px-4 text-base font-normal'
                                                    key={link.label}
                                                    variant="ghost"
                                                    render={<Link href={link.href} {...link.newTabProps} onClick={() => setOpen(false)} />}
                                                    nativeButton={false}
                                                >
                                                    {link.label}
                                                </Button>
                                            ))}
                                        </Drawer.Content>
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