"use client";

import { useSetAtom } from "jotai";
import { selectedTransactionIdAtom } from "../providers";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { nanoid } from "nanoid";

export default function AddTransactionButton() {
	const setSelectedTransactionId = useSetAtom(selectedTransactionIdAtom);

	return (
		<Button
			variant={"ghost"}
			size={"icon"}
			className="rounded-full"
			onClick={() => {
				// TODO create new file
				setSelectedTransactionId(nanoid());
			}}
		>
			<Plus className="h-4 w-4 text-muted-foreground" />
		</Button>
	);
}
