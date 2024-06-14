"use client";

import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface NavItemProps {
	href: string;
	title: string;
}

export default function NavItem({ href, title }: NavItemProps) {
	const segment = usePathname().split("/")?.[1];

	return (
		<Link href={href}>
			<Button
				variant={"ghost"}
				className="group h-12 rounded-none justify-start text-sm font-normal data-[active=true]:border-b-2 border-foreground data-[active=true]:text-foreground text-foreground  relative hover:bg-transparent  data-[active=true]:pb-[6px] "
				data-active={segment === href.split("/")[1]}
			>
				<div
					className="group-hover:bg-border absolute inset-0 my-[5px] data-[active=false]:mt-[5px] data-[active=false]:mb-[7px] rounded-sm  group-hover:bg-opacity-100  transition-opacity"
					data-active={segment === href.split("/")[1]}
				/>
				<span className="z-10">{title}</span>
			</Button>
		</Link>
	);
}
