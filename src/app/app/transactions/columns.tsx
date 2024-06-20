"use client";

import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import type { ChangeEvent } from "react";
import { MoreVertical } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import { readDataFile, writeDataFile } from "@/lib/tauri";
import TransactionDetails from "./details";
import { transactionMetaAtom, transactionsAtom } from "../../providers";
import { cn } from "@/lib/utils";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Transaction } from "@/types";

export const columns: ColumnDef<Transaction>[] = [
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row, column }) => {
			const date = new Date(row.getValue<Date>("date"));

			const dateString = date.toLocaleDateString();

			return <p>{dateString}</p>;
			// return (
			// 	<Popover>
			// 		<PopoverTrigger asChild>
			// 			<Button
			// 				variant={"ghost"}
			// 				className={cn(
			// 					"justify-start text-left font-normal  w-full",
			// 					!date && "text-muted-foreground",
			// 				)}
			// 			>
			// 				{dateString}
			// 			</Button>
			// 		</PopoverTrigger>
			// 		<PopoverContent className="w-auto p-0">
			// 			<Calendar
			// 				mode="single"
			// 				selected={date}
			// 				onSelect={async (date) => {
			// 					if (!date) throw new Error("Date is undefined");
			// 					// changeDate(column.id, date);
			// 				}}
			// 				initialFocus
			// 			/>
			// 		</PopoverContent>
			// 	</Popover>
			// );
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		// cell: ({ row }) => {
		// 	const name = row.getValue<string>("name");
		// 	const [input, setInput] = useState(name);

		// 	return (
		// 		<Input
		// 			value={input}
		// 			onChange={(e) => setInput(e.target.value)}
		// 			className="border-0 shadow-none  flex-1 hover:bg-accent w-40"
		// 		/>
		// 	);
		// },
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		// cell: ({ row }) => {
		// 	const amount = row.getValue<number>("amount");

		// 	const setTransactions = useSetAtom(transactionsAtom);

		// 	const handleInputChange = (data: ChangeEvent<HTMLInputElement>) => {
		// 		setTransactions((transactions) => {
		// 			return transactions.map((transaction) => {
		// 				if (transaction.id !== row.id) return transaction;

		// 				const newData = { ...transaction, ammount: data.target.value };

		// 				writeDataFile(`${row.id}.json`, JSON.stringify(newData));
		// 				return newData;
		// 			});
		// 		});
		// 	};
		// 	return (
		// 		<Input
		// 			defaultValue={amount}
		// 			onChange={handleInputChange}
		// 			className="border-0 shadow-none hover:bg-accent w-28"
		// 		/>
		// 	);
		// },
	},
	{
		accessorKey: "running-total",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Total" />
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
	const setTransactionMeta = useSetAtom(transactionMetaAtom);

	return (
		<>
			<div className="flex items-center justify-end">
				<Button
					variant="ghost"
					className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 hidden lg:flex"
					onClick={() => setTransactionMeta({id})}
				>
					<span className="sr-only">Open menu</span>
					<MoreVertical className="h-4 w-4" />
				</Button>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 lg:hidden"
							onClick={() => setTransactionMeta({id})}
						>
							<span className="sr-only">Open menu</span>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent className="w-[400px] sm:w-[540px]">
						<TransactionDetails />
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}