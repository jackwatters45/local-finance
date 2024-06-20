"use client";

import { useDebouncedCallback } from "use-debounce";
import type React from "react";
import type { Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useUpdateTransaction } from "@/lib/hooks";
import type { BaseInput, InputBaseProps } from "@/types";
import type { z } from "zod";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";

type TransactionDetailInputProps<T extends BaseInput> = InputBaseProps<T> &
	Omit<React.InputHTMLAttributes<HTMLInputElement>, "form"> & {
		omitLabel?: boolean;
	};

export default function Input<T extends BaseInput>(
	props: TransactionDetailInputProps<T>,
) {
	const updateTransaction = useUpdateTransaction();

	const handleInputChange = useDebouncedCallback((data: string | number) => {
		const id = props.form.watch("id" as Path<T>);
		updateTransaction(id, { [props.name]: data });
	}, 300);

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				if (!props.type && typeof field.value !== "string") {
					throw new Error("Input must be a string when type is not specified");
				}
				if (props.type === "number" && typeof field.value !== "number") {
					throw new Error("Invalid must be a number when type is number");
				}
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						{!props.omitLabel && (
							<FormLabel className="min-w-32 font-medium">{props.label}</FormLabel>
						)}
						<FormControl>
							<ShadcnInput
								className={cn("hover:bg-accent flex-1", props.className)}
								placeholder={props.placeholder ?? props.label}
								type={props.type}
								{...field}
								value={field.value}
								onChange={(e) => {
									field.onChange(e.target.value);
									handleInputChange(e.target.value);
								}}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}
