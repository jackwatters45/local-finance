import type { Settings } from "@/types";

export const APP_NAME = "local-finance";
export const APP_NAME_PRETTY = "Local Finance";

export const SETTINGS_FILE = ".settings.json";
export const SUBDIRECTORIES = [
	"transactions",
	"bills",
	"budgets",
] as const;

export const BASE_DIRECTORY = "AppConfig";
export const APP_DIRECTORY = `${APP_NAME_PRETTY} Vault`;

export const DEFAULT_ONBOARDING = true;
export const DEFAULT_STARTING_BALANCE = 0;

export const DEFAULT_CATEGORIES = [
	"Business",
	"Childcare",
	"Education",
	"Entertainment",
	"Food & Drink",
	"Gifts & Donations",
	"Health",
	"Home",
	"Personal",
	"Pet Care",
	"Transit",
	"Other",
];

export const DEFAULT_TAGS = ["Important", "Review Later"];

export const DEFAULT_SETTINGS: Settings = {
	config: {
		user: {
			isOnboarded: DEFAULT_ONBOARDING,
			startingBalance: DEFAULT_STARTING_BALANCE,
		},
		options: {
			category: DEFAULT_CATEGORIES,
			company: [],
			tags: DEFAULT_TAGS,
		},
	},
};

export const RESET_SETTINGS: Settings = {
	config: {
		user: {
			isOnboarded: false,
			startingBalance: DEFAULT_STARTING_BALANCE,
		},
		options: {
			category: DEFAULT_CATEGORIES,
			company: [],
			tags: DEFAULT_TAGS,
		},
	},
};

