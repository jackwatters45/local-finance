"use client";

import React from "react";
import { useSetAtom } from "jotai";
import type { Path, PathValue } from "react-hook-form";
import { Check, Delete, X } from "lucide-react";

import { writeSettingsFile } from "@/lib/tauri";
import { cn, toTitleCase } from "@/lib/utils";
import { useMirroredWidth, useUpdateTransaction } from "@/lib/hooks";
import type { BaseInput, ConfigOption, InputBaseProps } from "@/types";
import { settingsAtom } from "@/app/providers";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SelectInputProps<T extends BaseInput> extends InputBaseProps<T> {
	options: Array<string>;
}

export function SelectInput<T extends BaseInput>(props: SelectInputProps<T>) {
	const [open, setOpen] = React.useState(false);

	const [buttonRef, buttonWidth] = useMirroredWidth();

	const label = props.label ?? toTitleCase(props.name);

	const updateTransaction = useUpdateTransaction(props.subdirectory);
	const handleDeleteOption = () => {
		const id = props.form.watch("id" as Path<T>);

		props.form.setValue(props.name, "" as PathValue<T, Path<T>>);
		updateTransaction(id, { [props.name]: "" });
	};

	const handleValueChange = (data: string) => {
		const id = props.form.watch("id" as Path<T>);

		updateTransaction(id, { [props.name]: data });
		props.form.setValue(props.name, data as PathValue<T, Path<T>>);
	};

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				if (typeof field.value !== "string" && typeof field.value !== "number") {
					throw new Error(
						`Invalid value. Must be a string or number. Received: ${typeof field.value}`,
					);
				}
				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						<FormLabel className="min-w-32 font-medium">{label}</FormLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="ghost"
										role="combobox"
										ref={buttonRef as React.RefObject<HTMLButtonElement>}
										className={cn(
											"flex-1 justify-start",
											!field.value && "text-muted-foreground",
										)}
									>
										{field.value ? (
											<Badge
												onClick={(e) => {
													if (!open) return;
													e.preventDefault();
													handleDeleteOption();
												}}
											>
												{field.value}
												<X
													className={cn("ml-1 -mr-1 h-3 w-3", open ? "block" : "hidden")}
												/>
											</Badge>
										) : (
											`Select ${label}`
										)}
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="p-0" style={{ width: buttonWidth }}>
								<SelectCommand
									{...props}
									name={props.name as ConfigOption}
									value={field.value}
									label={label}
									handleValueChange={handleValueChange}
								/>
							</PopoverContent>
						</Popover>
					</FormItem>
				);
			}}
		/>
	);
}

export function MultiSelectInput<T extends BaseInput>(
	props: SelectInputProps<T>,
) {
	const [open, setOpen] = React.useState(false);

	const [buttonRef, buttonWidth] = useMirroredWidth();

	const label = props.label ?? toTitleCase(props.name);

	const updateTransaction = useUpdateTransaction(props.subdirectory);
	const handleDeleteOption = (option: string) => {
		const id = props.form.watch("id" as Path<T>);

		const current = props.form.watch(props.name) as string[];
		const newValue = [...current.filter((value) => value !== option)];

		props.form.setValue(props.name, newValue as PathValue<T, Path<T>>);
		updateTransaction(id, { [props.name]: newValue });
	};

	const handleValueChange = (data: string) => {
		const id = props.form.watch("id" as Path<T>);

		const current = props.form.watch(props.name) as string[];

		if (current.find((o) => o.toLowerCase() === data.toLowerCase())) {
			const newValue = [...current.filter((value) => value !== data)];

			props.form.setValue(props.name, newValue as PathValue<T, Path<T>>);
			updateTransaction(id, { [props.name]: newValue });

			return;
		}

		const newValue = [...current, data];

		props.form.setValue(props.name, newValue as PathValue<T, Path<T>>);
		updateTransaction(id, { [props.name]: newValue });
	};

	return (
		<FormField
			control={props.form.control}
			name={props.name}
			render={({ field }) => {
				const value = field.value as unknown;
				if (!Array.isArray(value))
					throw new Error(
						`Invalid value. Must be an array. Received: ${typeof value}`,
					);

				return (
					<FormItem className="flex items-center text-sm h-10 space-y-0">
						<FormLabel className="min-w-32 font-medium">{props.label}</FormLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="ghost"
										role="combobox"
										ref={buttonRef as React.RefObject<HTMLButtonElement>}
										className={cn(
											"flex-1 justify-start",
											!value.length && "text-muted-foreground",
										)}
									>
										<div className="flex items-center gap-1">
											{value.length
												? value.map((option) => (
														<Badge
															key={option}
															onClick={(e) => {
																if (!open) return;
																e.preventDefault();
																handleDeleteOption(option);
															}}
														>
															{option}
															<X
																className={cn("ml-1 -mr-1 h-3 w-3", open ? "block" : "hidden")}
															/>
														</Badge>
													))
												: `Select ${props.label}`}
										</div>
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="p-0" style={{ width: buttonWidth }}>
								<SelectCommand
									{...props}
									name={props.name as ConfigOption}
									value={value}
									label={label}
									handleValueChange={handleValueChange}
								/>
							</PopoverContent>
						</Popover>
					</FormItem>
				);
			}}
		/>
	);
}

interface SelectCommandProps<T extends BaseInput>
	extends Omit<SelectInputProps<T>, "name"> {
	name: ConfigOption;
	value: string[] | string;
	handleValueChange: (data: string) => void;
}

function SelectCommand<T extends BaseInput>(props: SelectCommandProps<T>) {
	const setSettings = useSetAtom(settingsAtom);

	const [search, setSearch] = React.useState("");
	function createNewOption(data: string) {
		setSearch("");

		const newCategory = toTitleCase(data);

		props.handleValueChange(newCategory);

		if (props.options.find((o) => o.toLowerCase() === data.toLowerCase())) return;

		setSettings((settings) => {
			const newSettings = {
				...settings,
				config: {
					...settings.config,
					[props.name]: [
						...(settings.config.options[props.name] ?? []),
						newCategory,
					],
				},
			};

			writeSettingsFile(newSettings);
			return newSettings;
		});
	}

	function handleClickCreateNew() {
		if (search === "") return;
		createNewOption(search);
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" && search !== "") {
			e.preventDefault();
			createNewOption(search);
		}
	}

	return (
		<Command>
			<CommandInput
				placeholder={props.placeholder ?? "Search options..."}
				value={search}
				onValueChange={setSearch}
				onKeyDown={handleKeyDown}
			/>
			<CommandList>
				<CommandEmpty
					onClick={handleClickCreateNew}
					className={cn(search !== "" && "hover:bg-accent")}
				>
					{search === "" ? (
						<div className="text-muted-foreground h-6">No options yet...</div>
					) : (
						<div className="h-6">
							<span className="pr-2">{`Create New ${props.label}:`}</span>
							<Badge variant="outline">{search}</Badge>
						</div>
					)}
				</CommandEmpty>
				<CommandGroup
					className={cn(search === "" && !props.options.length && "p-0")}
				>
					{props.options.map((option) => (
						<CommandItem
							value={option}
							key={option}
							onSelect={(e) => props.handleValueChange(e)}
							className="group"
						>
							<Check
								className={cn(
									"mr-2 h-4 w-4",
									props.value.includes(option) || props.value === option
										? "opacity-100"
										: "opacity-0",
								)}
							/>
							<span className="flex-1">{option}</span>
							<DeleteOption option={option} label={props.label} name={props.name} />
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</Command>
	);
}

function DeleteOption(props: {
	option: string;
	label: string;
	name: ConfigOption;
}) {
	const setSettings = useSetAtom(settingsAtom);
	const deleteOption = (option: string) => {
		setSettings((settings) => {
			const newSettings = {
				...settings,
				config: {
					...settings.config,
					[props.name]: settings.config.options[props.name]?.filter(
						(o) => o !== option,
					),
				},
			};

			writeSettingsFile(newSettings);
			return newSettings;
		});
	};

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="absolute text-foreground right-2 opacity-0 rounded-md group-hover:opacity-100 h-6 w-6 pr-[2px] hover:bg-accent-stacked"
				>
					<Delete className="h-4 w-4" />
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{`Deleting ${props.option} from ${props.label}`}</AlertDialogTitle>
					<AlertDialogDescription>
						Deleting this option will not remove it from transactions but will remove
						it from the list of options for this field.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={() => deleteOption(props.option)}>
						Continue
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
