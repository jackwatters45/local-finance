"use client";

import { useDebouncedCallback } from "use-debounce";
import type React from "react";
import type { Path } from "react-hook-form";

import { cn } from "@/lib/utils";
import { useUpdateTransaction } from "@/lib/hooks";
import type { BaseInput, InputBaseProps } from "@/types";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";

interface SelectInputProps<T extends BaseInput> extends InputBaseProps<T> {
	options: Array<string>;
}

interface InputProps<T extends BaseInput>
	extends InputBaseProps<T>,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, "form" | "name" | "type"> {
	omitLabel?: boolean;
	type?: "text" | "number";
}

export default function Input<T extends BaseInput>(props: InputProps<T>) {
	const updateTransaction = useUpdateTransaction(props.subdirectory);

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
					throw new Error(
						`Input must be a string when type is not specified. Received: ${typeof field.value}`,
					);
				}
				if (props.type === "number" && typeof field.value !== "number") {
					throw new Error(
						`Invalid must be a number when type is number. Received: ${typeof field.value}`,
					);
				}
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						{!props.omitLabel && (
							<FormLabel className="min-w-32 font-medium">{props.label}</FormLabel>
						)}
						<FormControl>
							<ShadcnInput
								className={cn(
									"hover:bg-accent flex-1 border-none shadow-none",
									props.className,
								)}
								placeholder={props.placeholder ?? props.label}
								type={props.type}
								{...field}
								value={field.value}
								onChange={(e) => {
									const value =
										props.type === "number"
											? Number.parseFloat(e.target.value)
											: e.target.value;

									field.onChange(value);
									handleInputChange(value);
								}}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}
