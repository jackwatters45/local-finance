"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Footer() {
	return (
		<footer className="h-12 border-t border-border w-full text-sm text-accent-foreground">
			<div className="mx-auto h-full flex items-center justify-between max-w-screen-2xl px-8">
				<div className="flex items-center gap-8">
					<a className="hover:underline hover:opacity-90" href="/about">
						About
					</a>
					<a className="hover:underline hover:opacity-90" href="/resources">
						Resources
					</a>
					<a className="hover:underline hover:opacity-90" href="/editor">
						Editor
					</a>
				</div>
				<div className="flex items-center gap-4">
					<div>{new Date().getFullYear()}</div>
					<ModeToggle />
				</div>
			</div>
		</footer>
	);
}

export function ModeToggle() {
	const { setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon">
					<Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
					<Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
					<span className="sr-only">Toggle theme</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}