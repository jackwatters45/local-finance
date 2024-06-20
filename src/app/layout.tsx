"use client";

import "./globals.css";

import { Inter } from "next/font/google";

import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// TODO suppressHydrationWarning
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<div className="flex flex-col h-screen">{children}</div>
				</Providers>
			</body>
		</html>
	);
}
