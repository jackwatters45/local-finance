import type { Settings, Transaction } from "@/types";
import { APP_DIRECTORY } from "./constants";
import {
	BaseDirectory,
	createDir,
	readDir,
	readTextFile,
	removeFile,
	writeTextFile,
} from "@tauri-apps/api/fs";
import superjson from "superjson";

export const createBaseDirectory = async () => {
	await createDir(APP_DIRECTORY, {
		dir: BaseDirectory.AppConfig,
		recursive: true,
	});

	const baseDirectory = "AppConfig";

	await createDir(APP_DIRECTORY, {
		dir: BaseDirectory.AppConfig,
		recursive: true,
	});

	await writeTextFile(
		`${APP_DIRECTORY}/.settings.json`,
		superjson.stringify({ theme: "system", baseDirectory, APP_DIRECTORY }),
		{
			dir: BaseDirectory.AppConfig,
		},
	);
};

export async function writeDataFile<T>(
	fileName: string,
	content: T,
): Promise<void> {
	try {
		const stringified = superjson.stringify(content);
		await writeTextFile(`${APP_DIRECTORY}/${fileName}`, stringified, {
			dir: BaseDirectory.AppData,
		});
		console.log(`Data written to ${fileName}`);
	} catch (error) {
		console.error(`Error writing file ${fileName}:`, error);
	}
}

// TODO
export async function readSettingsFile(): Promise<Settings | null> {
	try {
		const content = await readTextFile(`${APP_DIRECTORY}/.settings.json`, {
			dir: BaseDirectory.AppData,
		});
		return superjson.parse<Settings>(content);
	} catch (error) {
		console.error("Error reading file .settings.json:", error);
		return null;
	}
}

export async function writeSettingsFile(content: Settings): Promise<void> {
	try {
		const stringified = superjson.stringify(content);
		await writeTextFile(`${APP_DIRECTORY}/.settings.json`, stringified, {
			dir: BaseDirectory.AppData,
		});
		console.log("Data written to .settings.json");
	} catch (error) {
		console.error("Error writing file .settings.json:", error);
	}
}

export async function readDataFile(
	fileName: string,
): Promise<Transaction | null> {
	try {
		const content = await readTextFile(`${APP_DIRECTORY}/${fileName}`, {
			dir: BaseDirectory.AppData,
		});
		return superjson.parse<Transaction>(content);
	} catch (error) {
		console.error(`Error reading file ${fileName}:`, error);
		return null;
	}
}

export async function readAllTransactions() {
	try {
		const dir = await readDir(APP_DIRECTORY, {
			dir: BaseDirectory.AppData,
		});

		const files: Transaction[] = [];
		for (const file of dir) {
			if (!file.name || file.name?.startsWith(".")) continue;

			const data = await readDataFile(file.name);

			if (data) files.push(data);
		}

		return files;
	} catch (error) {
		console.error("Error reading files:", error);
		return [];
	}
}

export async function deleteDataFile(fileName: string): Promise<void> {
	try {
		await removeFile(`${APP_DIRECTORY}/${fileName}.json`, {
			dir: BaseDirectory.AppData,
		});
		console.log(`Data deleted from ${fileName}`);
	} catch (error) {
		console.error(`Error deleting file ${fileName}:`, error);
	}
}
