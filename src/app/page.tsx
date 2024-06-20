"use client";

import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import { readAllTransactions, readSettingsFile } from "@/lib/tauri";
import { settingsAtom, transactionsAtom } from "./providers";

import { LoadingPage } from "@/components/ui/loading";
import { useRouter } from "next/navigation";

export default function Index() {
	const router = useRouter();

	const [settings, setSettings] = useAtom(settingsAtom);
	useEffect(() => {
		readSettingsFile().then((settings) => {
			if (!settings) return router.push("/onboarding");
			setSettings(settings);
		});
	}, [setSettings, router]);

	const [isLoading, setIsLoading] = useState(true);
	const [transactions, setTransactions] = useAtom(transactionsAtom);
	useEffect(() => {
		if (!settings) return;
		readAllTransactions().then((transactions) => {
			console.log("readAllTransactions", transactions);

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

console.log("transactions", transactions);
	if (isLoading) return <LoadingPage />;

	if (!settings.config.user.isOnboarded) return router.push("/onboarding");

	return router.push("/app/transactions");
}
