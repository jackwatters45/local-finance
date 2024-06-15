"use client";

import React, { useState } from "react";

import { open } from "@tauri-apps/plugin-dialog";

import { readTextFile, writeTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { Button } from "@/components/ui/button";

export default function Editor() {
	const [content, setContent] = useState("");
	const [filePath, setFilePath] = useState("");

	const openFile = async () => {
		const selectedPath = await open();
		if (selectedPath && typeof selectedPath === "string") {
			const fileContent = await readTextFile(selectedPath, {
				dir: BaseDirectory.App,
			});
			setFilePath(selectedPath);
			setContent(fileContent);
		}
	};

	const saveFile = async () => {
		if (filePath) {
			await writeTextFile(filePath, content, { dir: BaseDirectory.App });
		} else {
			// Optionally, handle saving to a new file
		}
	};

	return (
		<div className="space-y-4 flex flex-col w-96 p-12"> 
			<Button type="button" onClick={openFile}>
				Open
			</Button>
			<Button type="button" onClick={saveFile}>
				Save
			</Button>
			<textarea value={content} onChange={(e) => setContent(e.target.value)} />
		</div>
	);
}
