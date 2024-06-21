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
			value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
			onChange={(event) =>
				table.getColumn("name")?.setFilterValue(event.target.value)
			}
		/>
	);
}
