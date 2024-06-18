"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { atom, Provider as JotaiProvider } from "jotai";
import type { Transaction } from "@/types";

export const selectedTransactionIdAtom = atom<string | null>(null);

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
