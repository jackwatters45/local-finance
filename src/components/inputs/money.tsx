"use client";

import { useDebouncedCallback } from "use-debounce";
import type React from "react";
import type { Path, PathValue } from "react-hook-form";

import { cn, moneyFormatter } from "@/lib/utils";
import { useWriteInputToFile } from "@/lib/hooks";
import type { BaseInput, InputBaseProps } from "@/types";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input as ShadcnInput } from "@/components/ui/input";

interface NumberInputProps<T extends BaseInput>
	extends InputBaseProps<T>,
		Omit<React.InputHTMLAttributes<HTMLInputElement>, "form" | "name"> {}

// - see number input delete + show zeros (type zero in amt)
// - number formatting (0.00) + starts 0 + negative values
// - only allow number inputs

// settings -> comma or dot
export default function MoneyInput<T extends BaseInput>(
	props: NumberInputProps<T>,
) {
	const id = props.form.watch("id" as Path<T>);

	const writeInputToFile = useWriteInputToFile(props.subdirectory);
	const handleInputChange = useDebouncedCallback((data: string | null) => {
		writeInputToFile(id, { [props.name]: data });
	}, 300);

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						{props.label && (
							<FormLabel className="min-w-32 font-medium h-full flex items-center">
								{props.label}
							</FormLabel>
						)}
						<FormControl>
							<ShadcnInput
								placeholder={props.placeholder ?? "Empty"}
								{...field}
								value={field.value ? field.value : ""}
								onChange={(e) => {
									const cleanedInput = e.target.value.replace(/[^\d.,-]/g, "");
									const value = cleanedInput === "" ? null : cleanedInput;

									if (!value) {
										field.onChange(value);
										if (props.handleChange) props.handleChange(value);
										else handleInputChange(value);
										return;
									}

									field.onChange(value);

									const formattedValue = moneyFormatter.format(Number.parseFloat(value));
									if (props.handleChange) props.handleChange(formattedValue);
									else handleInputChange(formattedValue);
								}}
								onBlur={() => {
									const value = field.value
										? moneyFormatter.format(Number.parseFloat(field.value))
										: null;

									props.form.setValue(props.name, value as PathValue<T, Path<T>>);
								}}
								className={cn(
									"hover:bg-accent flex-1 border-none shadow-none",
									props.className,
								)}
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}
