"use client";

import React from "react";
import { useDebouncedCallback } from "use-debounce";
import type { Path } from "react-hook-form";

import { useWriteInputToFile } from "@/lib/hooks";
import type { BaseInput, InputBaseProps } from "@/types";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

type NotesFields = { notes: string } & BaseInput; // TODO this doesn't actaully do anything i hate ts
type NotesInputProps<T extends NotesFields> = Omit<
	InputBaseProps<T>,
	"label" | "placeholder"
>;

export default function NotesInput<T extends NotesFields>(
	props: NotesInputProps<T>,
) {
	const writeInputToFile = useWriteInputToFile(props.subdirectory);
	const handleInputChange = useDebouncedCallback((data: string) => {
		const id = props.form.watch("id" as Path<T>);
		writeInputToFile(id, { [props.name]: data });
	}, 300);

	return (
		<FormField
			control={props.form.control}
			name={props.name}
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
