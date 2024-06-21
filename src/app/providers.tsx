"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { atom, Provider as JotaiProvider } from "jotai";
import type { Bill, Budget, Settings, Transaction } from "@/types";
import { nanoid } from "nanoid";
import { DEFAULT_CATEGORIES } from "../lib/constants";

export const settingsAtom = atom<Settings>({
	config: {
		user: {
			isOnboarded: false,
			startingBalance: 0,
		},
		options: {
			category: DEFAULT_CATEGORIES,
			company: [],
			tags: [],
		},
	},
});

type MetaAtom = { id: string; isNew?: boolean };

export const budgetMetaAtom = atom<MetaAtom>({
	id: nanoid(),
	isNew: true,
});
export const budgetsAtom = atom<Budget[]>([]);

export const billMetaAtom = atom<MetaAtom>({
	id: nanoid(),
	isNew: true,
});
export const billsAtom = atom<Bill[]>([]);

export const transactionMetaAtom = atom<MetaAtom>({
	id: nanoid(),
	isNew: true,
});

export const transactionsAtom = atom<Transaction[]>([]);

export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<JotaiProvider>{children}</JotaiProvider>
		</ThemeProvider>
	);
}
