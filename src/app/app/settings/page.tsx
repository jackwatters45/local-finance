"use client";

import { useAtom } from "jotai";
import { useTheme } from "next-themes";

import { settingsAtom } from "@/app/providers";
import { writeSettingsFile } from "@/lib/tauri";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectTrigger,
	SelectValue,
	SelectContent,
	SelectItem,
} from "@/components/ui/select";

export default function Settings() {
	const { theme, setTheme } = useTheme();

	const [settings, setSettings] = useAtom(settingsAtom);

	const handleStartingBalanceChange = (
		e: React.ChangeEvent<HTMLInputElement>,
	) => {
		const value = e.target.valueAsNumber;

		setSettings((settings) => {
			const newSettings = {
				...settings,
				config: {
					...settings.config,
					user: {
						...settings.config.user,
						startingBalance: value,
					},
				},
			};

			writeSettingsFile(newSettings);
			return newSettings;
		});
	};

	return (
		<div className="mx-auto w-full max-w-screen-sm py-16 sm:py-32 px-8 min-h-screen col-span-full">
			<div className="space-y-8 animate-in animate fade-in-5 slide-in-from-bottom-2.5">
				<h1 className="text-xl font-semibold">Settings</h1>
				<Card className="rounded-none shadow-none bg-background border-none">
					<CardHeader>
						<CardTitle className="text-lg">Account Information</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<CardItem>
							<div>
								<Text>Starting Balance</Text>
								<SubText>How much money you got.</SubText>
							</div>
							<Input
								type="number"
								placeholder="Starting Balance"
								className="w-[180px]"
								defaultValue={settings.config.user.startingBalance}
								onChange={handleStartingBalanceChange}
							/>
						</CardItem>
						{/* TODO */}
						<CardItem>
							<div>
								<Text>Views</Text>
								<SubText>Default views for transactions, budgets, bills, etc</SubText>
							</div>
							<Button variant="outline" size="sm">
								Change
							</Button>
						</CardItem>
					</CardContent>
				</Card>

				<Separator />
				<Card className="rounded-none shadow-none bg-background border-none">
					<CardHeader>
						<CardTitle className="text-lg">System</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<CardItem>
							<div>
								<Text>Theme</Text>
								<SubText>Light or dark. Nothing fancy.</SubText>
							</div>

							<Select onValueChange={(theme) => setTheme(theme)} defaultValue={theme}>
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
									<SelectItem value="system">System</SelectItem>
								</SelectContent>
							</Select>
						</CardItem>
					</CardContent>
				</Card>
				<Separator />
				<Card className="rounded-none shadow-none bg-background border-none">
					<CardHeader>
						<CardTitle className="text-lg">Danger Zone</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<CardItem>
							<div>
								<Text>Reset Settings</Text>
								<SubText>Reset all settings to the default values.</SubText>
							</div>
							<Button variant="destructive" size="sm">
								Delete Settings
							</Button>
						</CardItem>
						<Separator />
						<CardItem>
							<div>
								<Text>Delete Data</Text>
								<SubText>Remove all your data from the app.</SubText>
							</div>
							<Button variant="destructive" size="sm">
								Delete Data
							</Button>
						</CardItem>
						<Separator />
						<CardItem>
							<div>
								<Text>Start over</Text>
								<SubText>Reset settings and delete all your data.</SubText>
							</div>
							<Button variant="destructive" size="sm">
								Delete All
							</Button>
						</CardItem>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

function CardItem({ children }: { children: React.ReactNode }) {
	return <div className="flex items-center justify-between">{children}</div>;
}

function Text(props: { children: string }) {
	return <div className="font-medium">{props.children}</div>;
}

function SubText({ children }: { children: React.ReactNode }) {
	return <div className="text-sm text-muted-foreground">{children}</div>;
}
