"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";

import { readAllFiles, readSettingsFile } from "@/lib/tauri";
import {
	billsAtom,
	budgetsAtom,
	settingsAtom,
	transactionsAtom,
} from "./providers";
import type { Bill, Budget, Transaction } from "@/types";

import { LoadingPage } from "@/components/ui/loading";

export default function Index() {
	const router = useRouter();

	// read settings
	const [settings, setSettings] = useAtom(settingsAtom);
	useEffect(() => {
		readSettingsFile().then((settings) => {
			if (!settings) return router.push("/onboarding");
			setSettings(settings);
		});
	}, [setSettings, router]);

	const [isLoading, setIsLoading] = useState(true);

	// start reading transactions
	const setTransactions = useSetAtom(transactionsAtom);
	useEffect(() => {
		if (!settings) return;
		readAllFiles<Transaction>("transactions").then((transactions) => {
			transactions.sort((a, b) => a.date.getTime() - b.date.getTime());

			let runningTotal = settings.config.user.startingBalance;
			for (const transaction of transactions) {
				runningTotal = runningTotal + transaction.amount;
				transaction.runningTotal = runningTotal;
			}

			setTransactions(transactions);
			setIsLoading(false);
		});
	}, [setTransactions, settings]);

	// start reading budgets
	const setBudgets = useSetAtom(budgetsAtom);
	useEffect(() => {
		readAllFiles<Budget>("budgets").then((budgets) => {
			budgets.sort((a, b) => a.date.getTime() - b.date.getTime());
			setBudgets(budgets);
		});
	}, [setBudgets]);

	// start reading bills
	const setBills = useSetAtom(billsAtom);
	useEffect(() => {
		readAllFiles<Bill>("bills").then((bills) => {
			bills.sort((a, b) => a.date.getTime() - b.date.getTime());
			setBills(bills);
		});
	}, [setBills]);

	if (isLoading) return <LoadingPage />;

	if (!settings.config.user.isOnboarded) return router.push("/onboarding");

	return router.push("/app/transactions");
}
