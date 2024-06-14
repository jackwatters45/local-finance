"use client";

import { MoreVertical, PanelRightOpen } from "lucide-react";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { changeDate } from "./actions";
import {
	SheetDescription,
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import TransactionDetails from "./transaction-details";
import { useSetAtom } from "jotai";
import { selectedTransactionIdAtom } from "../providers";

export type Transaction = {
	id: string;
	date: Date;
	name: string;
	amount: number;
	category: string; // TODO
	tags: string[]; // TODO
	recurring: boolean;
	notes: string;
	history: string; // TODO
};

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row, column }) => {
			const date = new Date(row.getValue<Date>("date"));

			const dateString = date.toLocaleDateString();

			return (
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant={"ghost"}
							className={cn(
								"justify-start text-left font-normal p-0 w-full",
								!date && "text-muted-foreground",
							)}
						>
							{dateString}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={date}
							onSelect={async (date) => {
								if (!date) throw new Error("Date is undefined");
								changeDate(column.id, date);
							}}
							initialFocus
						/>
					</PopoverContent>
				</Popover>
			);
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => {
			const name = row.getValue<string>("name");
			const [input, setInput] = useState(name);

			return (
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					className="border-0 shadow-none -translate-x-3 flex-1"
				/>
			);
		},
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const amount = row.getValue<number>("amount");
			const [input, setInput] = useState(amount);

			return (
				<Input
					value={input}
					onChange={(e) => setInput(Number.parseInt(e.target.value))}
					className="border-0 shadow-none -translate-x-3"
				/>
			);
		},
	},
	{
		accessorKey: "running-total",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Running Total" />
		),
		cell: ({ row }) => {
			// TODO actual logic
			const amount = row.getValue<number>("amount");
			const runningTotal = amount + 234;
			
			return <p>{runningTotal}</p>;
		},
	},
	{
		id: "open",
		cell: ({ row }) => <OpenMenu id={row.id} />,
	},
];

function OpenMenu({ id }: { id: string }) {
	const setSelectedTransactionId = useSetAtom(selectedTransactionIdAtom);

	return (
		<>
			<Button
				variant="ghost"
				className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 hidden lg:flex"
				onClick={() => setSelectedTransactionId(id)}
			>
				<span className="sr-only">Open menu</span>
				<MoreVertical className="h-4 w-4" />
			</Button>
			<Sheet>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 lg:hidden"
						onClick={() => setSelectedTransactionId(id)}
					>
						<span className="sr-only">Open menu</span>
						<MoreVertical className="h-4 w-4" />
					</Button>
				</SheetTrigger>

				<SheetContent className="w-[400px] sm:w-[540px]">
					<TransactionDetails />
				</SheetContent>
			</Sheet>
		</>
	);
}
