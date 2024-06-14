"use client";

import type * as React from "react";
import { ThemeProvider } from "next-themes";
import { atom, Provider as JotaiProvider } from "jotai";

export const selectedTransactionIdAtom = atom<string | null>(null);

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
