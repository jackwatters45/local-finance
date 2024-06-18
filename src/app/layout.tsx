"use client";

import { Inter } from "next/font/google";
import "./globals.css";

import Nav from "@/components/nav/nav";
import Footer from "@/components/nav/footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		// TODO suppressHydrationWarning
		<html lang="en" >
			<body className={inter.className}>
				<Providers>
					<div className="flex flex-col h-screen">
						<Nav />
						<main className="bg-background text-foreground flex flex-col flex-1">
							<div className="max-w-screen-lg w-full mx-auto lg:grid lg:grid-cols-2 lg:max-w-screen-2xl flex-1">
								{children}
							</div>
						</main>
						<Footer />
					</div>
				</Providers>
			</body>
		</html>
	);
}
