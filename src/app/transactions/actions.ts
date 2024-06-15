"use server";

import { BaseDirectory, create } from "@tauri-apps/plugin-fs";

export async function createRepository(name: string) {
	// await create("users", { dir: BaseDirectory.AppData, recursive: true });
}

export async function changeDate(id: string, date: Date) {
	// write to file...
	console.log("changeDate", date);
	return "date ?? new Date();";
}
