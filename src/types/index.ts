import type { SUBDIRECTORIES } from "@/lib/constants";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type Subdirectory = (typeof SUBDIRECTORIES)[number];

export type ScheduledOptions = "days" | "weeks" | "months" | "years";

export type Schedule = {
	num: number | null;
	range: ScheduledOptions | null;
};

export type Transaction = {
	id: string;
	date: Date;
	name: string;
	amount: number | null;
	category: string; // TODO
	company: string;
	tags: string[]; // TODO
	schedule: Schedule | null;
	notes: string;
	runningTotal: number;
	// history: string; // TODO
};

export type Budget = {
	id: string;
	date: Date;
	name: string;
	amount: number | null;
	category: string;
	tags: string[];
	schedule: Schedule | null;
	notes: string;
};

export type Bill = {
	id: string;
	date: Date;
	name: string;
	amount: number | null;
	category: string;
	company: string;
	tags: string[];
	schedule: Schedule | null;
	notes: string;
};

type OptionsConfig = {
	category: string[];
	company: string[];
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

export type Theme = "light" | "dark" | "system";

export type Settings = {
	config: Config;
};

export type BaseInput = { id: string } & FieldValues;

export type InputBaseProps<T extends BaseInput> = {
	form: UseFormReturn<T>;
	name: Path<T>;
	label?: string;
	placeholder?: string;
	subdirectory: Subdirectory;
	handleChange?: (data: unknown, field?: unknown) => void;
};
