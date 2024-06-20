import type { transactionFormSchema } from "@/app/transactions/details-form";
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
	// history: string; // TODO
};

export type Config = {
	options: ConfigOptions;
};

export type ConfigOptions = {
	category: string[];
	tags: string[];
};

export type ConfigOption = keyof ConfigOptions;

// TODO refine
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
