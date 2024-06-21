"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useAtom } from "jotai";

import { settingsAtom } from "../providers";
import { Button } from "@/components/ui/button";
import { APP_NAME_PRETTY } from "@/lib/constants";
import { createBaseDirectory, writeSettingsFile } from "@/lib/tauri";

// TODO add recuring field to transactions
// TODO add a notes page
export default function Onboarding() {
	const [settings, setSettings] = useAtom(settingsAtom);

	useEffect(() => {
		if (settings) return;
		createBaseDirectory();
	}, [settings]);

	const handleClick = () => {
		setSettings((settings) => {
			const newSettings = {
				...settings,
				config: {
					...settings.config,
					user: {
						...settings.config.user,
						isOnboarded: true,
					},
				},
			};

			writeSettingsFile(newSettings);
			return newSettings;
		});
	};

	return (
		<div className="mx-auto w-full max-w-screen-sm py-16 sm:py-32 px-8 min-h-screen">
			<div className="space-y-8 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
				<div className="space-y-6 text-lg">
					<h1 className="text-3xl font-bold">{APP_NAME_PRETTY}</h1>
					<p>
						This is a simple app to help you mindfully track your finances. It is
						meant to emulate tracking finances on a pen-and-paper ledger, rather than
						a traditional finance app.
					</p>
					<p>
						The goal is to help you be more conscious of your spending while not
						having to worry about the details, making financial management more
						approachable and stress-free.
					</p>
					<p>
						Our app features a minimalist design to reduce distractions and help you
						focus on your financial habits.You can track transactions, budgets, bills,
						and view simple reports.
					</p>
					<p>
						We recommend using {APP_NAME_PRETTY} to track daily finances and
						occasionally checking your bank and credit card statements to make sure
						you haven't missed any unexpected expenses.
					</p>
					<p>
						Inspired by keeping a pen-and-paper ledger, we've built this app to be
						local only. Your data is stored locally on your device and is not synced
						to any cloud service.
					</p>
				</div>
				<Link href="/app/transactions" className="block">
					<Button className="w-full" onClick={handleClick}>
						Get Started
					</Button>
				</Link>
			</div>
		</div>
	);
}
