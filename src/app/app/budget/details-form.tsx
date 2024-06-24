"use client";

import React from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { deleteDataFile } from "@/lib/tauri";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import type { Budget } from "@/types";
import { MoreHorizontal } from "lucide-react";
import { settingsAtom, budgetMetaAtom, budgetsAtom } from "../../providers";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import Input from "../../../components/inputs/input";
import DateInput from "../../../components/inputs/date";
import NotesInput from "../../../components/inputs/notes";
import {
	SelectInput,
	MultiSelectInput,
} from "../../../components/inputs/select";
import { getDefaultBudget } from "@/lib/utils";
import { scheduleSchema } from "@/lib/shared";
import NumberInput from "@/components/inputs/number";

export const budgetFormSchema = z.object({
	id: z.string(),
	name: z.string().min(2, {
		message: "Name must be at least 2 characters.",
	}),
	date: z.date(),
	amount: z.number().nullable(),
	category: z.string(),
	tags: z.array(z.string()),
	schedule: scheduleSchema.nullable(),
	notes: z.string(),
});

export default function BudgetItemForm({
	budget,
}: { budget: Partial<Budget> | null }) {
	const settings = useAtomValue(settingsAtom);

	const form = useForm<z.infer<typeof budgetFormSchema>>({
		resolver: zodResolver(budgetFormSchema),
		defaultValues: getDefaultBudget(budget),
	});

	React.useEffect(() => {
		form.reset(getDefaultBudget(budget));
	}, [budget, form]);

	return (
		<Form {...form}>
			<form>
				<div className="space-y-8 py-12 lg:px-8">
					<div className="w-full flex items-center justify-between">
						<Input
							form={form}
							name="name"
							placeholder="Untitled Budget"
							className="w-full text-xl flex-1 font-semibold -translate-x-4"
							subdirectory="budgets"
						/>
						<div className="pl-4 lg:pr-8">
							<MoreOptionsDropdown form={form} />
						</div>
					</div>
					<div>
						<NumberInput
							form={form}
							name="amount"
							label="Amount"
							subdirectory="budgets"
						/>
						<DateInput form={form} name="date" label="Date" subdirectory="budgets" />
						<SelectInput
							form={form}
							name="category"
							label="Category"
							options={settings.config.options.category ?? []}
							subdirectory="budgets"
						/>
						<MultiSelectInput
							form={form}
							name="tags"
							label="Tags"
							options={settings.config.options.tags ?? []}
							subdirectory="budgets"
						/>
					</div>
					<Separator />
					<NotesInput form={form} name="notes" subdirectory="budgets" />
				</div>
			</form>
		</Form>
	);
}

function MoreOptionsDropdown({
	form,
}: { form: UseFormReturn<z.infer<typeof budgetFormSchema>> }) {
	const setBudgets = useSetAtom(budgetsAtom);
	const setBudgetMeta = useSetAtom(budgetMetaAtom);
	const handleDelete = () => {
		const id = form.watch("id");

		setBudgetMeta({ id: nanoid(), isNew: true });

		setBudgets((budgets) => {
			return budgets.filter((budget) => budget.id !== id);
		});

		deleteDataFile("budgets", `${id}.json`);
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
