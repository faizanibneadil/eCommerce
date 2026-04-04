import { cn } from "@/lib/utils";
import React from "react";
import { Portal, PortalBackdrop } from "@/components/ui/portal";
import { Button } from "@/components/ui/button";
import { XIcon, MenuIcon } from "lucide-react";
import Link from "next/link";
import { ShoppingCart } from "@/globals/Header/ShoppingCart";
import { useAuth } from "@/providers/Auth";
import { UserMenu } from "@/globals/Header/UserMenu";

export function MobileNav(props: {
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
	const { user, status } = useAuth()
	const [open, setOpen] = React.useState(false);

	return (
		<div className="md:hidden">
			<div className="flex gap-px items-center">
				<ShoppingCart />
				{Boolean(user) ? (
					<UserMenu />
				) : (
					<Button className={cn({ 'cursor-not-allowed': status === 'loading' })} size="sm" variant="outline" nativeButton={false} render={<Link href={status === 'loading' ? '#' : '/login'} />}>
						Sign In
					</Button>
				)}
				<Button
					aria-controls="mobile-menu"
					aria-expanded={open}
					aria-label="Toggle menu"
					className="md:hidden"
					onClick={() => setOpen(!open)}
					size="icon-sm"
					variant="outline"
				>
					{open ? (
						<XIcon className="size-4.5" />
					) : (
						<MenuIcon className="size-4.5" />
					)}
				</Button>

			</div>
			{open && (
				<Portal className="top-14" id="mobile-menu">
					<PortalBackdrop />
					<div
						className={cn(
							"data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
							"size-full p-4"
						)}
						data-slot={open ? "open" : "closed"}
					>
						<div className="grid gap-y-2">
							{props?.menu?.map((link) => (
								<Button className="justify-start" key={link.label} variant="ghost" render={<Link href={link.href} {...link.newTabProps} />} nativeButton={false}>{link.label}</Button>
							))}
						</div>
						{/* <div className="mt-12 flex flex-col gap-2">
							<Button className="w-full">Get Started</Button>
							<Button className="w-full" variant="outline">
								Sign In
							</Button>
						</div> */}
					</div>
				</Portal>
			)
			}
		</div >
	);
}
