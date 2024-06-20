import type { transactionFormSchema } from "@/app/app/transactions/details-form";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { z, ZodType } from "zod";

export type Transaction = {
	id: string;
	date: Date;
	name: string;
	amount: number;
	category: string; // TODO
	tags: string[]; // TODO
	recurring: boolean;
	notes: string;
	runningTotal: number;
	// history: string; // TODO
};

type OptionsConfig = {
	category: string[];
	tags: string[];
};
export type ConfigOption = keyof OptionsConfig;

type UserCofig = {
	startingBalance: number;
	isOnboarded: boolean;
};

export type Config = {
	user: UserCofig;
	options: OptionsConfig;
};

export type Settings = {
	theme: "system" | "light" | "dark";
	baseDirectory: string | undefined;
	appDirectory: string | undefined;
	config: Config;
};

export type BaseInput = { id: string } & FieldValues;

export type InputBaseProps<T extends BaseInput> = {
	form: UseFormReturn<T>;
	name: Path<T>;
	label: string;
	placeholder?: string;
};
