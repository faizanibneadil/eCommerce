'use client';
import * as React from 'react';
import { Dialog } from '@base-ui/react/dialog';

// Modern Loader & Success Animations
const StatusAnimation = ({ type }: { type: 'loading' | 'success' }) => {
    if (type === 'success') {
        return (
            <div className="flex items-center justify-center h-24 w-24 rounded-full bg-green-500/10">
                <svg className="w-14 h-14 text-green-500 animate-in zoom-in duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative h-24 w-24">
            <div className="absolute inset-0 border-4 border-gray-200/20 dark:border-white/10 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center space-x-1.5">
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    );
};

export default function OrderConfirmationDrawer(props: {
    transactionStatus: string | null
}) {
    const [showSuccess, setShowSuccess] = React.useState(false);
    const [isInternalOpen, setIsInternalOpen] = React.useState(false);
    const popupRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (props.transactionStatus) {
            setIsInternalOpen(true);
            setShowSuccess(false);
        } else if (isInternalOpen) {
            setShowSuccess(true);
            const timer = setTimeout(() => {
                setIsInternalOpen(false);
                setShowSuccess(false);
            }, 2500);
            return () => clearTimeout(timer);
        }
    }, [props.transactionStatus, isInternalOpen]);

    return (
        <Dialog.Root open={isInternalOpen} disablePointerDismissal={true}>
            <Dialog.Portal>
                <Dialog.Backdrop className="fixed inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity duration-500 z-50" />

                <Dialog.Viewport className="fixed inset-0 z-60 flex items-end md:items-center justify-center">
                    <Dialog.Popup
                        ref={popupRef}
                        className="outline-0 relative w-full md:w-auto 
                        /* Mobile: Rounded-t-2xl (Same as your UserMenuDrawer) | MD+: Rounded-2xl */
                        rounded-t-2xl md:rounded-2xl 
                        bg-white dark:bg-gray-950 md:bg-transparent md:dark:bg-transparent
                        shadow-none 
                        p-10 md:p-6
                        transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
                        data-starting-style:translate-y-full md:data-starting-style:translate-y-4 md:data-starting-style:opacity-0
                        data-ending-style:translate-y-full md:data-ending-style:translate-y-4 md:data-ending-style:opacity-0"
                    >
                        {/* Mobile Handle */}
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 h-1.5 w-10 rounded-full bg-gray-200 dark:bg-gray-800 md:hidden" />

                        <div className='flex flex-col items-center text-center'>
                            <div className="mb-8">
                                <StatusAnimation type={showSuccess ? 'success' : 'loading'} />
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white md:text-white">
                                    {showSuccess ? "Order Placed!" : (props.transactionStatus || "Processing")}
                                </h3>

                                <div className="flex justify-center w-full">
                                    <p className="text-base leading-relaxed max-w-75 text-gray-500 dark:text-gray-400 md:text-gray-300">
                                        {showSuccess
                                            ? "Congrats! Your order has been placed successfully. Get ready to enjoy your purchase!"
                                            : "Please hold on a moment while we verify your transaction details."
                                        }
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 h-1 w-1 bg-transparent rounded-full" />
                        </div>
                    </Dialog.Popup>
                </Dialog.Viewport>
            </Dialog.Portal>
        </Dialog.Root>
    );
}