"use client";

import Footer from "@/components/nav/footer";
import Nav from "@/components/nav/nav";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<>
			<Nav />
			<main className="bg-background text-foreground flex flex-col flex-1">
				<div className="relative max-w-screen-lg w-full mx-auto lg:grid lg:grid-cols-2 lg:max-w-screen-2xl flex-1 ">
					{children}
				</div>
			</main>
			<Footer />
		</>
	);
}
