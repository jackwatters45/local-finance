import type { Transaction } from "@/types";
import { APP_DIRECTORY } from "../app/constants";
import {
	BaseDirectory,
	createDir,
	readDir,
	readTextFile,
	removeFile,
	writeTextFile,
} from "@tauri-apps/api/fs";

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
		JSON.stringify({ theme: "system", baseDirectory, APP_DIRECTORY }),
		{
			dir: BaseDirectory.AppConfig,
		},
	);
};

export async function writeDataFile(
	fileName: string,
	content: string,
): Promise<void> {
	try {
		await writeTextFile(`${APP_DIRECTORY}/${fileName}`, content, {
			dir: BaseDirectory.AppData,
		});
		console.log(`Data written to ${fileName}`);
	} catch (error) {
		console.error(`Error writing file ${fileName}:`, error);
	}
}

export async function readTransactionData(
	fileName: string,
): Promise<Transaction | null> {
	try {
		const content = await readTextFile(`${APP_DIRECTORY}/${fileName}`, {
			dir: BaseDirectory.AppData,
		});
		return JSON.parse(content);
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

			const data = await readTransactionData(file.name);

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
