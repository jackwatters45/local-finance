"use client";

import React from "react";
import type { Path, PathValue } from "react-hook-form";
import { X } from "lucide-react";

import { cn, getNextScheduledDate, toTitleCase } from "@/lib/utils";
import { useMirroredWidth, useWriteInputToFile } from "@/lib/hooks";
import type { BaseInput, InputBaseProps, Schedule } from "@/types";
import { DEFAULT_SCHEDULE, SCHEDULE_OPTIONS } from "@/lib/constants";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { BasicSelectInput } from "./select";
import { Label } from "../ui/label";
import NumberInput from "./number";

interface ScheduledInputProps<T extends BaseInput> extends InputBaseProps<T> {
	options: Array<string>;
}

export default function ScheduledInput<T extends BaseInput>(
	props: ScheduledInputProps<T>,
) {
	const [open, setOpen] = React.useState(false);

	const [buttonRef, buttonWidth] = useMirroredWidth();

	const id = props.form.watch("id" as Path<T>);
	const schedule = props.form.watch(props.name as Path<T>) as Schedule | null;
	const startDate = props.form.watch("date" as Path<T>) as Date | null;

	// biome-ignore lint/correctness/useExhaustiveDependencies: <idk wrong or smthg>
	const nextScheduledDate = React.useMemo(() => {
		return schedule && startDate
			? getNextScheduledDate(startDate, schedule)
			: null;
	}, [schedule?.num, schedule?.range, startDate]);

	const writeInputToFile = useWriteInputToFile(props.subdirectory);
	const handleDeleteOption = () => {
		props.form.setValue(props.name, null as PathValue<T, Path<T>>);
		writeInputToFile(id, { [props.name]: null });
	};

	const handleValueChange = () => {
		writeInputToFile(id, { [props.name]: schedule });
	};

	return (
		<div className="flex items-center text-sm h-10 space-y-0">
			{props.label && (
				<Label className="min-w-32 font-medium h-full flex items-center">
					{props.label}
				</Label>
			)}
			<Popover
				open={open}
				onOpenChange={(currentOpen) => {
					if (!schedule && currentOpen) {
						props.form.setValue(
							props.name,
							DEFAULT_SCHEDULE as PathValue<T, Path<T>>,
						);

						writeInputToFile(id, { [props.name]: DEFAULT_SCHEDULE });
					}

					setOpen(currentOpen);
				}}
			>
				<PopoverTrigger asChild>
					<Button
						variant="ghost"
						role="combobox"
						ref={buttonRef as React.RefObject<HTMLButtonElement>}
						className={cn(
							"flex-1 justify-start",
							!schedule && "text-muted-foreground",
						)}
					>
						{schedule?.num && schedule?.range
							? `${schedule.num} ${toTitleCase(schedule.range)}`
							: props.placeholder ?? "Empty"}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					style={{ width: buttonWidth }}
					className="flex items-center justify-between"
				>
					<div className="flex items-center gap-2">
						<NumberInput
							form={props.form}
							name={`${props.name}.num` as Path<T>}
							subdirectory={props.subdirectory}
							placeholder={props.placeholder ?? "Empty"}
							className="w-20 border border-border border-solid items-end justify-end hover:bg-transparent"
							handleChange={handleValueChange}
						/>
						<BasicSelectInput
							form={props.form}
							name={`${props.name}.range` as Path<T>}
							options={SCHEDULE_OPTIONS}
							triggerProps={{ className: "border border-border", includeCaret: true }}
							subdirectory={props.subdirectory}
							handleChange={handleValueChange}
						/>
					</div>
					<div className="flex items-center gap-2 w-">
						{buttonWidth > 384 && nextScheduledDate && (
							<div className="text-sm text-muted-foreground">
								Next: {nextScheduledDate.toLocaleDateString()}
							</div>
						)}
						<Button
							variant="ghost"
							size="icon"
							className="rounded-full"
							onClick={() => {
								setOpen(false);
								handleDeleteOption();
							}}
						>
							<span className="sr-only">Close</span>
							<X className="h-4 w-4" />
						</Button>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
