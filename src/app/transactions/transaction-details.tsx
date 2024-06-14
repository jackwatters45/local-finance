"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { transactions } from "../page";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { selectedTransactionIdAtom } from "../providers";
import { useAtomValue } from "jotai";

export default function TransactionDetails() {
	const transactionId = useAtomValue(selectedTransactionIdAtom);

	if (!transactionId) return "no transaction selected";

	// TODO actually read file
	const transaction = transactions[Number.parseInt(transactionId)];

	return (
		<div className="space-y-8 py-12 px-8">
			<div className="w-full flex items-center justify-between">
				<h3 className="text-xl font-semibold ">{transaction.name}</h3>
				<div className="pr-8">
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button variant={"ghost"} size={"icon"} className="rounded-full">
								<MoreHorizontal className="h-4 w-4 text-muted-foreground" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem>Delete</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
			<div>
				<div className="flex items-center space-x-4 text-sm h-10">
					<div className="w-32">
						<h4 className="font-medium">Amount</h4>
					</div>
					<p className="">{transaction.amount}</p>
				</div>
				<div className="flex items-center space-x-4 text-sm h-10">
					<div className="w-32">
						<h4 className="font-medium">Date</h4>
					</div>
					<p className="text-sm">{transaction.date.toLocaleDateString()}</p>
				</div>
				<div className="flex items-center space-x-4 text-sm h-10">
					<div className="w-32">
						<h4 className="font-medium">Category</h4>
					</div>
					<p className="text-sm">{transaction.category}</p>
				</div>
				<div className="flex items-center space-x-4 text-sm h-10">
					<div className="w-32">
						<h4 className="font-medium">Tags</h4>
					</div>
					<div className="space-x-2 flex flex-wrap">
						{transaction.tags.map((tag) => (
							<Badge
								key={tag}
								className="text-sm rounded-md py-0 px-1 border-foreground"
								variant={"outline"}
							>
								{tag}
							</Badge>
						))}
					</div>
				</div>
				<Button
					variant={"ghost"}
					className="text-muted-foreground -translate-x-4"
				>
					<span>Add field</span>
				</Button>
			</div>

			<Separator />
			<div className="flex flex-col space-y-4">
				<h4 className="font-medium">Notes</h4>
				<p className="text-sm">{transaction.notes}</p>
			</div>
		</div>
	);
}
