"use client";

import React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteDataFile } from "@/lib/tauri";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { MoreHorizontal } from "lucide-react";

import type { Transaction } from "@/types";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import {
	settingsAtom,
	transactionMetaAtom,
	transactionsAtom,
} from "../../providers";
import Input from "../../../components/inputs/input";
import DateInput from "../../../components/inputs/date";
import NotesInput from "../../../components/inputs/notes";
import {
	SelectInput,
	MultiSelectInput,
	BasicSelectInput,
} from "../../../components/inputs/select";
import { getDefaultTransaction } from "@/lib/utils";
import { SCHEDULE_OPTIONS } from "@/lib/constants";
import ScheduledInput from "@/components/inputs/scheduled";
import { scheduleSchema } from "@/lib/shared";
import MoneyInput from "@/components/inputs/money";

export const transactionFormSchema = z.object({
	id: z.string(),
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	date: z.date(),
	amount: z
		.string()
		.nullable()
		.transform((val) => (val ? Number.parseFloat(val) : null)),
	category: z.string(),
	company: z.string(),
	tags: z.array(z.string()),
	schedule: scheduleSchema.nullable(),
	notes: z.string(),
	runningTotal: z.number(),
});

// TODO add some focused bg for inputs
// TODO select + multi select (tags + categories)
export default function TransactionForm({
	transaction,
}: { transaction: Partial<Transaction> | null }) {
	const settings = useAtomValue(settingsAtom);

	const form = useForm<z.infer<typeof transactionFormSchema>>({
		resolver: zodResolver(transactionFormSchema),
		defaultValues: getDefaultTransaction(transaction),
	});

	React.useEffect(() => {
		form.reset(getDefaultTransaction(transaction));
	}, [transaction, form]);

	return (
		<Form {...form}>
			<form>
				<div className="space-y-8 py-12 lg:px-8">
					<div className="w-full flex items-center justify-between">
						<Input
							form={form}
							name="name"
							placeholder="Untitled Transaction"
							className="w-full text-xl flex-1 font-semibold -translate-x-4"
							subdirectory="transactions"
						/>
						<div className="pl-4 lg:pr-8">
							<MoreOptionsDropdown form={form} />
						</div>
					</div>
					<div>
						<MoneyInput
							form={form}
							name="amount"
							label="Amount"
							subdirectory="transactions"
						/>
						<DateInput
							form={form}
							name="date"
							label="Date"
							subdirectory="transactions"
						/>
						<SelectInput
							form={form}
							name="category"
							label="Category"
							options={settings.config.options.category ?? []}
							subdirectory="transactions"
						/>
						<SelectInput
							form={form}
							name="company"
							label="Company"
							options={settings.config.options.company ?? []}
							subdirectory="transactions"
						/>
						<MultiSelectInput
							form={form}
							name="tags"
							label="Tags"
							options={settings.config.options.tags ?? []}
							subdirectory="transactions"
						/>
						<ScheduledInput
							form={form}
							name="schedule"
							label="Schedule"
							options={SCHEDULE_OPTIONS}
							subdirectory="transactions"
						/>
					</div>
					<Separator />
					<NotesInput form={form} name="notes" subdirectory="transactions" />
				</div>
			</form>
		</Form>
	);
}

function MoreOptionsDropdown({
	form,
}: { form: UseFormReturn<z.infer<typeof transactionFormSchema>> }) {
	const setTransactions = useSetAtom(transactionsAtom);
	const setTransactionMeta = useSetAtom(transactionMetaAtom);
	const handleDelete = () => {
		const id = form.watch("id");

		setTransactionMeta({ id: nanoid(), isNew: true });

		setTransactions((transactions) => {
			return transactions.filter((transaction) => transaction.id !== id);
		});

		deleteDataFile("transactions", `${id}.json`);
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"} size={"icon"} className="rounded-full p-0">
					<MoreHorizontal className="h-5 w-5 text-muted-foreground" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
