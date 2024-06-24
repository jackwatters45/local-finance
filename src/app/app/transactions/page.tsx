"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { nanoid } from "nanoid";

import { columns } from "@/app/app/transactions/columns";
import { readAllFiles } from "@/lib/tauri";
import type { Transaction } from "@/types";
import {
	settingsAtom,
	transactionMetaAtom,
	transactionsAtom,
} from "@/app/providers";

import { OpenSidebarButton } from "@/components/ui/open-sidebar-button";
import TransactionDetails from "@/app/app/transactions/details";
import { LoadingPage } from "@/components/ui/loading";
import { DataTable } from "@/components/data-table/data-table";

export default function Transactions() {
	const settings = useAtomValue(settingsAtom);

	const [transactions, setTransactions] = useAtom(transactionsAtom);
	useEffect(() => {
		readAllFiles<Transaction>("transactions").then((transactions) => {
			transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

			let runningTotal = settings.config.user.startingBalance;
			for (const transaction of transactions) {
				runningTotal = runningTotal + (transaction.amount ?? 0);
				transaction.runningTotal = runningTotal;
			}

			setTransactions(transactions);
		});
	}, [setTransactions, settings.config.user.startingBalance]);

	const setTransactionMeta = useSetAtom(transactionMetaAtom);

	if (!transactions) return <LoadingPage />;

	return (
		<>
			<div className="space-y-4 pb-12 pt-24">
				<div className="flex items-center justify-between max-h-screen">
					<h2 className="text-xl font-semibold px-8">Transactions</h2>
					<div className="pr-2">
						<OpenSidebarButton
							onClick={() => setTransactionMeta({ id: nanoid(), isNew: true })}
							sidebarContent={<TransactionDetails />}
						/>
					</div>
				</div>
				<DataTable columns={columns} data={transactions} />
			</div>
			<div className="hidden lg:block h-full border-l border-border py-12 relative ">
				<TransactionDetails />
			</div>
		</>
	);
}
