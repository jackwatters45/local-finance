import { appCacheDir, appConfigDir, appDataDir } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/api/dialog";

export async function yeet() {
	try {
		const appConfigDirPath = await appConfigDir();
		const appDataDirPath = await appDataDir();

		console.log({
			appConfigDirPath,
			appDataDirPath,
		});

		const selected = await open({
			directory: true,
			defaultPath: appConfigDirPath,
		});

		console.log({ selected });
	} catch (error) {
		console.error("Error creating directory:", error);
	}
}
