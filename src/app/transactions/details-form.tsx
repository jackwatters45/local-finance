"use client";

import React from "react";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { Transaction } from "@/types";
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
import { Input } from "@/components/ui/input";
import {
	TransactionDetailDateInput,
	TransactionDetailInput,
	TransactionDetailNotesInput,
} from "./details-inputs";
import { useSetAtom } from "jotai";
import { transactionsAtom } from "../providers";
import { deleteDataFile } from "@/lib/tauri";

export const formSchema = z.object({
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
	isNew: z.boolean().optional(),
});

export const getDefaultTransaction = (
	transaction: Partial<Transaction> | null,
) => {
	const base = {
		id: transaction?.id ?? nanoid(),
		name: transaction?.name ?? "",
		date: transaction?.date ? new Date(transaction.date) : new Date(),
		amount: transaction?.amount ?? 0,
		category: transaction?.category ?? "",
		tags: transaction?.tags ?? [],
		recurring: transaction?.recurring ?? false,
		notes: transaction?.notes ?? "",
	};

	return !transaction?.id
		? {
				...base,
				isNew: true,
			}
		: base;
};

// TODO add some focused bg for inputs
// TODO select + multi select (tags + categories)
export default function TransactionForm({
	transaction,
}: { transaction: Transaction | null }) {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: getDefaultTransaction(transaction),
	});

	React.useEffect(() => {
		form.reset(getDefaultTransaction(transaction));
	}, [transaction, form]);

	const setTransactions = useSetAtom(transactionsAtom);
	const handleDelete = () => {
		const id = form.watch("id");

		deleteDataFile(id);

		setTransactions((transactions) => {
			return transactions.filter((transaction) => transaction.id !== id);
		});
	};

	return (
		<Form {...form}>
			<form>
				<div className="space-y-8 py-12 lg:px-8">
					<div className="w-full flex items-center justify-between">
						<TransactionDetailInput
							form={form}
							name="name"
							placeholder="Transaction Name"
							className="w-full text-xl flex-1 font-semibold p-0"
							includeLabel={false}
						/>
						<div className="pl-4 lg:pr-8">
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
						</div>
					</div>
					<div>
						<TransactionDetailInput form={form} name="amount" type="number" />
						<TransactionDetailDateInput form={form} name="date" />
						{/* TODO select */}
						<FormField
							control={form.control}
							name="category"
							render={({ field }) => (
								<FormItem className="flex items-center text-sm h-10 space-y-0">
									<FormLabel className="min-w-32 w-32 font-medium">Category</FormLabel>
									<FormControl>
										<Input
											placeholder="Category"
											className="hover:bg-accent flex-1"
											{...field}
										/>
									</FormControl>
								</FormItem>
							)}
						/>
						{/* TODO multi select */}
						<FormField
							control={form.control}
							name="tags"
							render={({ field }) => (
								<FormItem className="flex items-center text-sm h-10 space-y-0">
									<FormLabel className="w-32 font-medium">Tags</FormLabel>
									<FormControl>
										<div className="space-x-2 flex flex-wrap">
											{field?.value?.map((tag) => (
												<Badge
													key={tag}
													className="text-sm rounded-md py-0 px-1 border-foreground"
													variant={"outline"}
												>
													{tag}
												</Badge>
											))}
										</div>
									</FormControl>
								</FormItem>
							)}
						/>
						{/* <Button
							variant={"ghost"}
							type="button"
							className="text-muted-foreground -translate-x-4"
						>
							<span>Add field</span>
						</Button> */}
					</div>
					<Separator />
					<TransactionDetailNotesInput form={form} name="notes" />
				</div>
			</form>
		</Form>
	);
}
