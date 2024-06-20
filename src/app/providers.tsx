"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { atom, Provider as JotaiProvider } from "jotai";
import type { Settings, Transaction } from "@/types";
import { nanoid } from "nanoid";
import { CATEGORIES } from "../lib/constants";

export const transactionMetaAtom = atom<{ id: string | null; isNew?: boolean }>(
	{
		id: nanoid(),
		isNew: true,
	},
);

export const settingsAtom = atom<Settings>({
	theme: "system",
	baseDirectory: "",
	appDirectory: "",
	config: {
		options: {
			category: CATEGORIES,
			tags: [],
		},
	},
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
