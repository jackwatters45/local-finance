"use client";

import React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteDataFile } from "@/lib/tauri";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import type { BaseInput, Transaction } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";

import {
	settingsAtom,
	transactionMetaAtom,
	transactionsAtom,
} from "../../providers";
import Input from "../../../components/inputs/input";
import DateInput from "../../../components/inputs/date";
import NotesInput from "../../../components/inputs/notes";
import { SelectInput, MultiSelectInput } from "../../../components/inputs/select";
import { run } from "node:test";

export const transactionFormSchema = z.object({
	id: z.string(),
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	date: z.date(),
	amount: z.number(),
	category: z.string(),
	tags: z.array(z.string()),
	recurring: z.boolean(),
	notes: z.string(),
	runningTotal: z.number(),
});

export const getDefaultTransaction = (
	transaction: Partial<Transaction> | null,
) => ({
	id: transaction?.id ?? nanoid(),
	name: transaction?.name ?? "",
	date: transaction?.date ? new Date(transaction.date) : new Date(),
	amount: transaction?.amount ?? 0,
	category: transaction?.category ?? "",
	tags: transaction?.tags ?? [],
	recurring: transaction?.recurring ?? false,
	notes: transaction?.notes ?? "",
	runningTotal: transaction?.runningTotal ?? 0,
});

// TODO add some focused bg for inputs
// TODO select + multi select (tags + categories)
export default function TransactionForm({
	transaction,
}: { transaction: Transaction | null }) {
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
							placeholder="Transaction Name"
							label="Name"
							className="w-full text-xl flex-1 font-semibold -translate-x-4"
							omitLabel={true}
						/>
						<div className="pl-4 lg:pr-8">
							<MoreOptionsDropdown form={form} />
						</div>
					</div>
					<div>
						<Input form={form} name="amount" type="number" label="Amount" />
						<DateInput form={form} name="date" label="Date" />
						<SelectInput
							form={form}
							name="category"
							label="Category"
							options={settings.config.options.category ?? []}
						/>
						<MultiSelectInput
							form={form}
							name="tags"
							label="Tags"
							options={settings.config.options.tags ?? []}
						/>
					</div>
					<Separator />
					<NotesInput form={form} name="notes" />
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

		deleteDataFile(id);
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
