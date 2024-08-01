import type { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";

interface DataTableFilterProps<TData> {
	table: Table<TData>;
}

// TODO seach all fields (even hidden) + non searchable fields
export default function DataTableFilter<TData>({
	table,
}: DataTableFilterProps<TData>) {
	return (
		<Input
			placeholder="Search..."
			className="my-8 px-8 shadow-none border-0 rounded-none focus-visible:ring-0 w-full focus-visible:border-ring border-b"
			id="search"
			name="search"
			value={table.getState().globalFilter ?? ""}
			onChange={(event) => table.setGlobalFilter(event.target.value)}
		/>
	);
}

// This function should be defined outside of the component and passed to the table instance
export function globalFilterFn(
	// biome-ignore lint/suspicious/noExplicitAny: <blah blah>
	row: any,
	_columnId: string,
	filterValue: string,
): boolean {
	const search = filterValue.toLowerCase();
	return Object.values(row.original).some((value) =>
		String(value).toLowerCase().includes(search),
	);
}
