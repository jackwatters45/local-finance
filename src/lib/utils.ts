import type {
	Bill,
	Budget,
	ConfigOption,
	Schedule,
	Settings,
	Transaction,
} from "@/types";
import { type ClassValue, clsx } from "clsx";
import { nanoid } from "nanoid";
import { twMerge } from "tailwind-merge";
import { DEFAULT_SCHEDULE } from "./constants";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toTitleCase = (str: string) =>
	str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
	);

export const hyphenToTitleCase = (str: string): string =>
	str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export const toHyphenCase = (str: string): string =>
	str.toLowerCase().split(" ").join("-");

type TransactionWithNum = Omit<Transaction, "amount"> & {
	amount: number | null;
};

export const getDefaultTransaction = (
	transaction: Partial<Transaction> | null,
): TransactionWithNum => ({
	id: transaction?.id ?? nanoid(),
	name: transaction?.name ?? "",
	date: transaction?.date ?? new Date(),
	amount: transaction?.amount ? Number.parseFloat(transaction.amount) : null,
	category: transaction?.category ?? "",
	company: transaction?.company ?? "",
	tags: transaction?.tags ?? [],
	schedule: transaction?.schedule ?? null,
	notes: transaction?.notes ?? "",
	runningTotal: transaction?.runningTotal ?? 0,
});

export const getDefaultBill = (bill: Partial<Bill> | null): Bill => ({
	id: bill?.id ?? nanoid(),
	name: bill?.name ?? "",
	date: bill?.date ?? new Date(),
	amount: bill?.amount ?? null,
	category: bill?.category ?? "",
	company: bill?.company ?? "",
	tags: bill?.tags ?? [],
	schedule: bill?.schedule ?? null,
	notes: bill?.notes ?? "",
});

export const getDefaultBudget = (budget: Partial<Budget> | null): Budget => ({
	id: budget?.id ?? nanoid(),
	name: budget?.name ?? "",
	date: budget?.date ?? new Date(),
	amount: budget?.amount ?? null,
	category: budget?.category ?? "",
	tags: budget?.tags ?? [],
	schedule: budget?.schedule ?? null,
	notes: budget?.notes ?? "",
});

export function getNextScheduledDate(
	startDate: Date | null,
	schedule: Schedule | null,
): Date | null {
	if (!schedule || !startDate || !schedule.num || !schedule.range) return null;

	const { num, range } = schedule;
	const nextDate = new Date(startDate);

	switch (range.toLowerCase()) {
		case "days":
			nextDate.setDate(nextDate.getDate() + num);
			break;
		case "weeks":
			nextDate.setDate(nextDate.getDate() + num * 7);
			break;
		case "months":
			nextDate.setMonth(nextDate.getMonth() + num);
			break;
		case "years":
			nextDate.setFullYear(nextDate.getFullYear() + num);
			break;
		default:
			throw new Error("Invalid range specified");
	}

	return nextDate;
}

export const moneyFormatter = Intl.NumberFormat("en-ES", {
	currency: "USD",
	currencySign: "accounting",
	minimumFractionDigits: 2,
	minimumIntegerDigits: 1,
});
