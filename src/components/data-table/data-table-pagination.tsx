import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div className=" flex items-center justify-between space-x-2 py-4">
			<Button
				variant="ghost"
				size="sm"
				className={cn(!table.getCanPreviousPage() && "invisible", "ml-6")}
				disabled={!table.getCanPreviousPage()}
				onClick={() => table.previousPage()}
			>
				Previous
			</Button>
			<Button
				variant="ghost"
				size="sm"
				onClick={() => table.nextPage()}
				className={cn(!table.getCanNextPage() && "invisible")}
			>
				Next
			</Button>
		</div>
	);
}
