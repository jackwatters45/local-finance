"use client";

import { useDebouncedCallback } from "use-debounce";
import type React from "react";
import type { Path } from "react-hook-form";

import { cn } from "@/lib/utils";
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
export default function NumberInput<T extends BaseInput>(
	props: NumberInputProps<T>,
) {
	const writeInputToFile = useWriteInputToFile(props.subdirectory);

	const handleInputChange = useDebouncedCallback((data: number | null) => {
		const id = props.form.watch("id" as Path<T>);
		writeInputToFile(id, { [props.name]: data });
	}, 300);

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				if (typeof field.value !== "number" && field.value !== null) {
					throw new Error(
						`Invalid. must be a number. Received: ${typeof field.value} ${JSON.stringify(field.value)}}`,
					);
				}
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
									const value = e.target.value === "" ? null : e.target.valueAsNumber;

									field.onChange(value);

									if (props.handleChange) props.handleChange(value);
									else handleInputChange(value);
								}}
								className={cn(
									"hover:bg-accent flex-1 border-none shadow-none",
									props.className,
								)}
								type="number"
							/>
						</FormControl>
					</FormItem>
				);
			}}
		/>
	);
}
