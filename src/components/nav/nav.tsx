"use client";

import { APP_NAME_PRETTY } from "@/lib/constants";
import NavItem from "./nav-item";
import type { NavItemProps } from "./nav-item";

export interface NavProps {
	items: Array<NavItemProps>;
}

const navItems: Array<NavItemProps> = [
	{
		href: "/app/transactions",
		title: "Transactions",
	},
	{
		href: "/app/budget",
		title: "Budget",
	},
	{
		href: "/app/bills",
		title: "Bills",
	},
	{
		href: "/app/reporting",
		title: "Reporting",
	},
	{
		href: "/app/settings",
		title: "Settings",
	},
];

export default function Nav() {
	return (
		<div className="w-full border-b border-border bg-background fixed z-10">
			<nav className="flex items-center justify-between w-full px-8 max-w-screen-2xl mx-auto lg:grid lg:grid-cols-2 lg:max-w-screen-2xl">
				<h1 className="text-lg font-semibold">{APP_NAME_PRETTY}</h1>
				<div>
					{navItems.map((item) => (
						<NavItem key={item.href} {...item} />
					))}
				</div>
			</nav>
		</div>
	);
}
