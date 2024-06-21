import superjson from "superjson";
import {
	BaseDirectory,
	createDir,
	readDir,
	readTextFile,
	removeDir,
	removeFile,
	writeTextFile,
} from "@tauri-apps/api/fs";
import type { Settings, Subdirectory } from "@/types";
import {
	APP_DIRECTORY,
	SUBDIRECTORIES,
	DEFAULT_SETTINGS,
	SETTINGS_FILE,
	RESET_SETTINGS,
} from "./constants";

export const createBaseDirectory = async () => {
	// create base directory
	await createDir(APP_DIRECTORY, {
		dir: BaseDirectory.AppConfig,
		recursive: true,
	});

	// create default directories
	for (const directory of SUBDIRECTORIES) {
		await createDir(`${APP_DIRECTORY}/${directory}`, {
			dir: BaseDirectory.AppConfig,
			recursive: true,
		});
	}

	// write default settings
	await writeTextFile(
		`${APP_DIRECTORY}/${SETTINGS_FILE}`,
		superjson.stringify(DEFAULT_SETTINGS),
		{
			dir: BaseDirectory.AppConfig,
		},
	);
};

export const resetSettingsFile = async () => {
	await writeTextFile(
		`${APP_DIRECTORY}/${SETTINGS_FILE}`,
		superjson.stringify({ RESET_SETTINGS }),
		{
			dir: BaseDirectory.AppConfig,
		},
	);
};

export const deleteDataSubdirectories = async () => {
	for (const directory of SUBDIRECTORIES) {
		await removeDir(`${APP_DIRECTORY}/${directory}`, {
			dir: BaseDirectory.AppConfig,
			recursive: true,
		});

		await createDir(`${APP_DIRECTORY}/${directory}`, {
			dir: BaseDirectory.AppConfig,
			recursive: true,
		});
	}
};

export const deleteDataSubdirectoriesAndSettings = async () => {
	await deleteDataSubdirectories();
	await resetSettingsFile();
};

export async function readSettingsFile(): Promise<Settings | null> {
	const path = `${APP_DIRECTORY}/${SETTINGS_FILE}`;
	try {
		const content = await readTextFile(path, {
			dir: BaseDirectory.AppData,
		});

		console.log(`readSettingsFile ${path}`);

		return superjson.parse<Settings>(content);
	} catch (error) {
		console.error(`Error reading file ${path}:, ${error}`);
		return null;
	}
}

export async function writeSettingsFile(content: Settings): Promise<void> {
	const path = `${APP_DIRECTORY}/${SETTINGS_FILE}`;
	try {
		const stringified = superjson.stringify(content);
		await writeTextFile(path, stringified, {
			dir: BaseDirectory.AppData,
		});

		console.log(`Data written to ${path}`);
	} catch (error) {
		console.error(`Error writing file ${path}: ${error}`);
	}
}

export async function writeDataFile<T>(
	subdirectory: Subdirectory,
	fileName: string,
	content: T,
): Promise<void> {
	const path = `${APP_DIRECTORY}/${subdirectory}/${fileName}`;
	try {
		const stringified = superjson.stringify(content);
		await writeTextFile(path, stringified, {
			dir: BaseDirectory.AppData,
		});

		console.log(`Data written to ${path}`);
	} catch (error) {
		console.error(`Error writing file ${path}: ${error}`);
	}
}

export async function readDataFile<T>(
	subdirectory: Subdirectory,
	fileName: string,
): Promise<T | null> {
	const path = `${APP_DIRECTORY}/${subdirectory}/${fileName}`;
	try {
		const content = await readTextFile(path, {
			dir: BaseDirectory.AppData,
		});

		console.log(`readDataFile ${path}`);

		return superjson.parse<T>(content);
	} catch (error) {
		console.error(`Error reading file ${path}: ${error}`);
		return null;
	}
}

export async function readAllFiles<T>(subdirectory: Subdirectory) {
	try {
		const startTime = performance.now();

		const dir = await readDir(`${APP_DIRECTORY}/${subdirectory}`, {
			dir: BaseDirectory.AppData,
		});

		const files: T[] = [];
		for (const file of dir) {
			if (!file.name || file.name?.startsWith(".")) continue;

			const data = await readDataFile<T>(subdirectory, file.name);

			if (data) files.push(data);
		}

		const endTime = performance.now();
		console.log(`readAllFiles took ${endTime - startTime}ms`);

		return files;
	} catch (error) {
		console.error("Error reading files:", error);
		return [];
	}
}

export async function deleteDataFile(
	subdirectory: Subdirectory,
	fileName: string,
): Promise<void> {
	const path = `${APP_DIRECTORY}/${subdirectory}/${fileName}`;
	try {
		await removeFile(path, {
			dir: BaseDirectory.AppData,
		});
		console.log(`Data deleted from ${path}`);
	} catch (error) {
		console.error(`Error deleting file ${path}: ${error}`);
	}
}
