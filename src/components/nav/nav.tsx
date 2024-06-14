import { Separator } from "../ui/separator";
import NavItem from "./nav-item";
import type { NavItemProps } from "./nav-item";

export interface NavProps {
	items: Array<NavItemProps>;
}

export default async function Nav({ items }: NavProps) {
	return (
		<div className="w-full border-b border-border">
			<nav className="flex items-center justify-between w-full px-8 max-w-screen-2xl mx-auto">
				<h1 className="text-lg font-semibold">Local Finance</h1>
				<div>
					{items.map((item) => (
						<NavItem key={item.href} {...item} />
					))}
				</div>
			</nav>
		</div>
	);
}
