import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function OpenSidebarButton(props: {
	onClick: () => void;
	sidebarContent: React.ReactNode;
}) {
	return (
		<>
			<Button
				variant={"ghost"}
				size={"icon"}
				className="rounded-full p-0 hidden lg:flex"
				onClick={props.onClick}
			>
				<span className="sr-only">Open new transaction</span>
				<Plus className="h-5 w-5 text-muted-foreground" />
			</Button>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size={"icon"}
						className="rounded-full h-8 w-8 border-transparent lg:hidden"
						onClick={props.onClick}
					>
						<span className="sr-only">Open new transaction</span>
						<Plus className="h-5 w-5 text-muted-foreground" />
					</Button>
				</SheetTrigger>
				<SheetContent className="w-[400px] sm:w-[540px]">
					{props.sidebarContent}
				</SheetContent>
			</Sheet>
		</>
	);
}
