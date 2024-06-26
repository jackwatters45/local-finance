"use client";

import React from "react";

import { useWriteInputToFile } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import type { BaseInput, InputBaseProps } from "@/types";
import type { Path } from "react-hook-form";

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

export default function DateInput<T extends BaseInput>(
	props: Omit<InputBaseProps<T>, "placeholder">,
) {
	const writeInputToFile = useWriteInputToFile(props.subdirectory);

	function handleSelect(data: Date | undefined) {
		const id = props.form.watch("id" as Path<T>);
		writeInputToFile(id, { [props.name]: data });
	}

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				const value = field.value as unknown;
				if (!(value instanceof Date))
					throw new Error(
						`Invalid value. Must be a date. Received: ${typeof value}`,
					);
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						<FormLabel className="min-w-32 font-medium h-full flex items-center">
							{props.label}
						</FormLabel>
						<Popover>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant={"ghost"}
										className={cn(
											"justify-start text-left font-normal flex-1",
											!value && "text-muted-foreground",
										)}
									>
										{value?.toLocaleDateString()}
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={value}
									onSelect={(value) => {
										field.onChange(value);

										if (props.handleChange) props.handleChange(value);
										else handleSelect(value);
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
