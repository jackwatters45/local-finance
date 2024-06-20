"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { columns } from "./transactions/columns";

import { Plus } from "lucide-react";
import {
	readAllTransactions,
	readDataFile,
	readSettingsFile,
} from "@/lib/tauri";
import {
	settingsAtom,
	transactionMetaAtom,
	transactionsAtom,
} from "./providers";

import { LoadingPage } from "@/components/ui/loading";
import { DataTable } from "../components/data-table/data-table";
import { Button } from "@/components/ui/button";
import TransactionDetails from "./transactions/details";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { nanoid } from "nanoid";

export default function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useAtom(transactionsAtom);

	// TODO start by loading enough to show the first page
	// TODO load more
	useEffect(() => {
		readAllTransactions().then((transactions) => {
			setIsLoading(false);
			setTransactions(transactions);
		});
	}, [setTransactions]);

	const setSettings = useSetAtom(settingsAtom);
	useEffect(() => {
		readSettingsFile().then((settings) => {
			if (!settings) return;
			setSettings(settings);
		});
	}, [setSettings]);
	if (isLoading) return <LoadingPage />;

	return (
		<>
			<div className="space-y-4 pb-12 pt-24 ">
				<div className="flex items-center justify-between max-h-screen">
					<h2 className="text-xl font-semibold px-8">Transactions</h2>
					<div className="pr-2">
						<NewTransactionButton />
					</div>
				</div>
				<DataTable columns={columns} data={transactions} />
			</div>
			<div className="hidden lg:block h-full border-l border-border py-12 relative ">
				{/* <div className=" fixed h-full bottom-0 top-0 py-12"> */}
				<TransactionDetails />
				{/* </div> */}
			</div>
		</>
	);
}

function NewTransactionButton() {
	const setTransactionMeta = useSetAtom(transactionMetaAtom);

	return (
		<>
			<Button
				variant={"ghost"}
				size={"icon"}
				className="rounded-full p-0 hidden lg:flex"
				onClick={() => setTransactionMeta({ id: nanoid(), isNew: true })}
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
						onClick={() => setTransactionMeta({ id: nanoid(), isNew: true })}
					>
						<span className="sr-only">Open new transaction</span>
						<Plus className="h-5 w-5 text-muted-foreground" />
					</Button>
				</SheetTrigger>
				<SheetContent className="w-[400px] sm:w-[540px]">
					<TransactionDetails />
				</SheetContent>
			</Sheet>
		</>
	);
}
