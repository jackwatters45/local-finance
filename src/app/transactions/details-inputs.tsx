"use client";

import type React from "react";
import type { Path, UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import { useDebouncedCallback } from "use-debounce";

import { getDefaultTransaction, type formSchema } from "./details-form";
import { writeDataFile } from "@/lib/tauri";
import { cn, toTitleCase } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSetAtom } from "jotai";
import { transactionsAtom } from "../providers";

type TransactionDetailBaseProps = {
	form: UseFormReturn<z.infer<typeof formSchema>>;
	name: Path<z.infer<typeof formSchema>>;
	label?: string;
	placeholder?: string;
};

type TransactionDetailInputProps = TransactionDetailBaseProps &
	Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> & {
		includeLabel?: boolean;
	};

function TransactionDetailInput({
	form,
	name,
	label = toTitleCase(name),
	placeholder = toTitleCase(name),
	includeLabel = true,
	...props
}: TransactionDetailInputProps) {
	const setTransactions = useSetAtom(transactionsAtom);

	const handleInputChange = useDebouncedCallback((e: string) => {
		const data = props.type === "number" ? Number(e) : e;

		const id = form.watch("id");
		const isNew = form.watch("isNew");

		if (isNew) {
			form.setValue("isNew", false);

			const newTransaction = getDefaultTransaction({ id, [name]: data });

			writeDataFile(`${id}.json`, newTransaction);

			return setTransactions((transactions) => {
				return [...transactions, newTransaction];
			});
		}

		setTransactions((transactions) => {
			return transactions.map((transaction) => {
				if (transaction.id !== id) return transaction;

				const newData = { ...transaction, [name]: data };

				writeDataFile(`${id}.json`, newData);
				return newData;
			});
		});
	}, 300);

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				if (typeof field.value !== "string" && typeof field.value !== "number") {
					throw new Error("Invalid value");
				}
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						{includeLabel && (
							<FormLabel className="min-w-32 font-medium">{label}</FormLabel>
						)}
						<FormControl>
							<Input
								className="hover:bg-accent flex-1"
								placeholder={placeholder}
								{...props}
								{...field}
								value={field.value}
								onChange={(e) => {
									handleInputChange(e.target.value);
									field.onChange(e.target.value);
								}}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}

function TransactionDetailDateInput({
	form,
	name,
	label = toTitleCase(name),
}: TransactionDetailBaseProps) {
	const setTransactions = useSetAtom(transactionsAtom);

	const handleSelect = (data: Date | undefined) => {
		const id = form.watch("id");
		const isNew = form.watch("isNew");

		if (isNew) {
			form.setValue("isNew", false);

			const newTransaction = getDefaultTransaction({ id, [name]: data });

			writeDataFile(`${id}.json`, newTransaction);

			return setTransactions((transactions) => {
				return [...transactions, newTransaction];
			});
		}

		setTransactions((transactions) => {
			return transactions.map((transaction) => {
				if (transaction.id !== id) return transaction;

				const newData = { ...transaction, [name]: data };

				writeDataFile(`${id}.json`, newData);
				return newData;
			});
		});
	};

	return (
		<FormField
			control={form.control}
			name={name}
			render={({ field }) => {
				if (!(field.value instanceof Date)) throw new Error("Invalid value");
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						<FormLabel className="min-w-32 font-medium">{label}</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"ghost"}
										className={cn(
											"justify-start text-left font-normal flex-1",
											!field.value && "text-muted-foreground",
										)}
									>
										{field.value?.toLocaleDateString()}
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={field.value}
									onSelect={(e) => {
										field.onChange(e);
										handleSelect(e);
									}}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</FormItem>
				);
			}}
		/>
	);
}

function TransactionDetailNotesInput({
	form,
	name,
}: TransactionDetailBaseProps) {
	const setTransactions = useSetAtom(transactionsAtom);

	const handleInputChange = useDebouncedCallback((data: string) => {
		const id = form.watch("id");

		setTransactions((transactions) => {
			return transactions.map((transaction) => {
				if (transaction.id !== id) return transaction;

				const newData = { ...transaction, [name]: data };

				writeDataFile(`${id}.json`, newData);
				return newData;
			});
		});
	}, 300);

	return (
		<FormField
			control={form.control}
			name="notes"
			render={({ field }) => (
				<FormItem className="flex flex-col space-y-4">
					<FormControl>
						<Textarea
							placeholder="Notes..."
							{...field}
							onChange={(e) => {
								handleInputChange(e.target.value);
								field.onChange(e.target.value);
							}}
						/>
					</FormControl>
				</FormItem>
			)}
		/>
	);
}

export {
	TransactionDetailInput,
	TransactionDetailDateInput,
	TransactionDetailNotesInput,
};
