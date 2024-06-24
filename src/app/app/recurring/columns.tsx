"use client";

import { useSetAtom } from "jotai";
import { MoreVertical } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

import BillDetails from "./details";
import { budgetMetaAtom } from "../../providers";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Bill } from "@/types";
import { moneyFormatter } from "@/lib/utils";

export const columns: ColumnDef<Bill>[] = [
	{
		accessorKey: "date",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Date" />
		),
		cell: ({ row }) => {
			const date = new Date(row.getValue<Date>("date"));
			return date.toLocaleDateString();
		},
	},
	{
		accessorKey: "name",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
	},
	{
		accessorKey: "amount",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Amount" />
		),
		cell: ({ row }) => {
			const amount = row.getValue<string | null>("amount");
			return amount ? moneyFormatter.format(Number.parseFloat(amount)) : null;
		},
	},

	{
		id: "open",
		cell: ({ row }) => <OpenMenu id={row.id} />,
	},
];

function OpenMenu({ id }: { id: string }) {
	const setBillMeta = useSetAtom(budgetMetaAtom);

	return (
		<>
			<div className="flex items-center justify-end">
				<Button
					variant="ghost"
					className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 hidden lg:flex"
					onClick={() => setBillMeta({ id })}
				>
					<span className="sr-only">Open menu</span>
					<MoreVertical className="h-4 w-4" />
				</Button>

				<Sheet>
					<SheetTrigger asChild>
						<Button
							variant="ghost"
							className="h-8 w-8 p-0 rounded-full border border-transparent hover:border-border focus-visible:right-0 lg:hidden"
							onClick={() => setBillMeta({ id })}
						>
							<span className="sr-only">Open menu</span>
							<MoreVertical className="h-4 w-4" />
						</Button>
					</SheetTrigger>
					<SheetContent className="w-[400px] sm:w-[540px]">
						<BillDetails />
					</SheetContent>
				</Sheet>
			</div>
		</>
	);
}
