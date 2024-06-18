"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { columns } from "./transactions/columns";

import { Plus } from "lucide-react";
import { readAllTransactions } from "@/lib/tauri";
import { selectedTransactionIdAtom, transactionsAtom } from "./providers";

import { LoadingPage } from "@/components/ui/loading";
import { DataTable } from "../components/data-table/data-table";
import { Button } from "@/components/ui/button";
import TransactionDetails from "./transactions/details";

export default function Home() {
	const setTransactionId = useSetAtom(selectedTransactionIdAtom);

	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useAtom(transactionsAtom);

	useEffect(() => {
		readAllTransactions().then((transactions) => {
			setIsLoading(false);
			setTransactions(transactions);
		});
	}, [setTransactions]);

	if (isLoading) return <LoadingPage />;

	return (
		<>
			<div className="space-y-4 py-12">
				<div className="flex items-center justify-between ">
					<h2 className="text-xl font-semibold px-8">Transactions</h2>
					<div className="pr-2">
						<Button
							variant={"ghost"}
							size={"icon"}
							className="rounded-full p-0"
							onClick={() => setTransactionId(null)}
						>
							<Plus className="h-5 w-5 text-muted-foreground" />
						</Button>
					</div>
				</div>
				<DataTable columns={columns} data={transactions} />
			</div>
			<div className="hidden lg:block border-l border-border">
				<TransactionDetails />
			</div>
		</>
	);
}
