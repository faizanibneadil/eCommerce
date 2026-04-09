"use client";
import { CMSImage } from "@/components/ui/CMSImage";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Header, Media, Setting } from "@/payload-types";
import Link from "next/link";
import { ShoppingCart } from "./ShoppingCart";
import UserMenuDrawer from "./Drawer";
import MobileNavDrawer from "./MobileNavDrawer";


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

export function HeaderClient(props: { headerConfig: Header, settingsConfig: Setting, logoSrc: Media }) {
	const scrolled = useScroll(10);
	const menu = props.headerConfig?.navItems?.map(item => ({
		label: item?.label,
		href: formatHref(item),
		newTabProps: item?.newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {}
	}))

	return (
		<header
			className={cn("sticky  z-10 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out", {
				"border-border bg-background/95 top-2.5 md:max-w-3xl md:shadow": scrolled,
			})}
		>
			<nav
				className={cn("overflow-hidden grid grid-cols-3 place-items-center justify-items-center h-14 w-full px-4 md:h-12 md:transition-all md:ease-out", {
					"md:px-2": scrolled,
				})}
			>
				<div className="justify-self-start">
					<MobileNavDrawer menu={menu} />
				</div>
				<Link
					className="rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50 overflow-hidden"
					href="/"
				>
					<CMSImage
						alt='logo'
						src={props.logoSrc}
						height={40}
						width={200}
						className="h-24 w-20"
					/>
				</Link>
				<div className="flex items-center gap-px justify-self-end">
					<ShoppingCart />
					<UserMenuDrawer />
				</div>
			</nav>
		</header>
	);
}
