"use client";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/logo";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { Header, Setting } from "@/payload-types";
import Link from "next/link";
import { getBase64Blur, getMediaUrl } from "@/utilities/getURL";
import { ShoppingCart } from "./ShoppingCart";
import Image from "next/image";


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
					<Image
						placeholder="blur"
						blurDataURL={getBase64Blur(props?.settingsConfig?.lightLogo)}
						src={getMediaUrl(props?.settingsConfig?.lightLogo)}
						className="h-24 w-20"
						alt='Logo'
						fetchPriority="high"
						loading="lazy"
						height={40}
						width={200}
					/>
				</a>
				<div className="hidden items-center gap-2 md:flex">
					<div>

						{menu?.map((link) => (
							<Button key={link.label} size="sm" variant="ghost" render={<Link href={link.href} {...link.newTabProps} />} nativeButton={false}>{link.label}</Button>
						))}
					</div>
					<ShoppingCart />
					<Button size="sm" variant="outline">
						Sign In
					</Button>
				</div>
				<MobileNav menu={menu} />
			</nav>
		</header>
	);
}
