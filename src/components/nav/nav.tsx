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
		href: "/app/budgeting",
		title: "Budgeting",
	},
	{
		href: "/app/recurring",
		title: "Recurring",
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
			<nav className="flex items-center justify-between w-full px-8 max-w-screen-2xl mx-auto">
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
