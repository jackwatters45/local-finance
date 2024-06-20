import type { ConfigOption, Settings } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const toTitleCase = (str: string) =>
	str.replace(
		/\w\S*/g,
		(txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase(),
	);

export const hyphenToTitleCase = (str: string): string =>
	str
		.split("-")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ");

export const toHyphenCase = (str: string): string =>
	str.toLowerCase().split(" ").join("-");

export const getUpdatedSettingsAdd = (
	settings: Settings,
	data: string,
	name: ConfigOption,
) => ({
	...settings,
	config: {
		...settings.config,
		name: [...(settings.config.options[name] ?? []), data],
	},
});


export const getUpdatedSettingsDelete = (
	settings: Settings,
	data: string,
	name: ConfigOption,
) => ({
	...settings,
	config: {
		...settings.config,
		[name]: settings.config.options[name]?.filter((option) => option !== data),
	},
});
