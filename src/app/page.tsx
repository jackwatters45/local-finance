import { DataTable } from "../components/data-table/data-table";
import { columns } from "./transactions/columns";
import type { Transaction } from "./transactions/columns";
import TransactionDetails from "./transactions/transaction-details";
import AddTransactionButton from "./transactions/add-transaction-button";
import { Button } from "@/components/ui/button";

export const transactions: Transaction[] = [
	{
		id: "728ed52f",
		date: new Date("2023-01-01"),
		name: "Example Payment",
		amount: 100,
		category: "Food",
		tags: ["lunch", "dinner"],
		recurring: false,
		notes:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		history: "",
	},
	{
		id: "ae0a9ee2",
		date: new Date("2023-01-02"),
		name: "Example Payment",
		amount: 200,
		category: "Food",
		tags: ["dinner", "dinner"],
		recurring: false,
		notes:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		history: "",
	},
	{
		id: "ee0a9ee2",
		date: new Date("2023-01-03"),
		name: "Example Payment",
		amount: 300,
		category: "Food",
		tags: ["dinner", "dinner"],
		recurring: false,
		notes:
			"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
		history: "",
	},
];

async function getData(): Promise<Transaction[]> {
	// Fetch data from your API here.
	return transactions;
}

export default async function Home() {
	const data = await getData();

	return (
		<>
			<div className="space-y-4 py-12">
				<div className="flex items-center justify-between ">
					<h2 className="text-xl font-semibold px-8">Transactions</h2>
					<div className="pr-2">
						<Button className="rounded-full">Create</Button>

						<AddTransactionButton />
					</div>
				</div>
				{/* TODO spacing of table */}
				<DataTable columns={columns} data={data} />
			</div>
			<div className="hidden lg:block border-l border-border">
				<TransactionDetails />
			</div>
		</>
	);
}
