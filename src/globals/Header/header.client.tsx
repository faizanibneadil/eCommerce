"use client";
import { MobileNav } from "@/components/mobile-nav";
import { CMSImage } from "@/components/ui/CMSImage";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Header, Setting } from "@/payload-types";
import { useAuth } from "@/providers/Auth";
import { getMedia } from "@/utilities/getMedia";
import Link from "next/link";
import { ShoppingCart } from "./ShoppingCart";
import { UserMenu } from "./UserMenu";


function formatHref(item: NonNullable<Header['navItems']>[number]) {
	let url: string = ''

	if (item?.type === 'external' && item?.url) {
		url = item?.url
	}

	if (item?.type === 'internal' && typeof item?.page?.value === 'object') {
		if (item?.page?.value?.enableCollection) {
			url = `/${item?.page?.value?.configuredCollectionSlug}`
		} else {
			url = `/${item?.page?.relationTo}/${item?.page?.value?.slug}`
		}
	}

	return url
}

export function HeaderClient(props: { headerConfig: Header, settingsConfig: Setting }) {
	const scrolled = useScroll(10);
	const { user, status } = useAuth()
	const menu = props.headerConfig?.navItems?.map(item => ({
		label: item?.label,
		href: formatHref(item),
		newTabProps: item?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
	}))

	return (
		<header
			className={cn("sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out", {
				"border-border bg-background/95 md:top-2 md:max-w-3xl md:shadow": scrolled,
			})}
		>
			<nav
				className={cn("overflow-hidden flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out", {
					"md:px-2": scrolled,
				})}
			>
				<a
					className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
					href="#"
				>
					{/* <Logo className="h-4" /> */}
					<CMSImage
						alt='logo'
						src={typeof props?.settingsConfig?.lightLogo === 'number'
							? getMedia(props?.settingsConfig?.lightLogo)
							: props?.settingsConfig?.lightLogo
						}
						height={40}
						width={200}
						className="h-24 w-20"
					/>
					{/* <Image
						placeholder="blur"
						blurDataURL={getBase64Blur(props?.settingsConfig?.lightLogo)}
						src={props?.settingsConfig?.lightLogo}
						className="h-24 w-20"
						alt='Logo'
						fetchPriority="high"
						loading="lazy"
						height={40}
						width={200}
					/> */}
				</a>
				<div className="hidden items-center gap-2 md:flex">
					<div>

						{menu?.map((link) => (
							<Button key={link.label} size="sm" variant="ghost" render={<Link href={link.href} {...link.newTabProps} />} nativeButton={false}>{link.label}</Button>
						))}
					</div>
					<ShoppingCart />
					{Boolean(user) ? (
						<UserMenu />
					) : (
						<Button className={cn({ 'cursor-not-allowed': status === 'loading' })} size="sm" variant="outline" nativeButton={false} render={<Link href={status === 'loading' ? '#' : '/login'} />}>
							Sign In
						</Button>
					)}
				</div>
				<MobileNav menu={menu} />
			</nav>
		</header>
	);
}
