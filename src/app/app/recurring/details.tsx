import { useAtomValue } from "jotai";
import { billMetaAtom } from "../../providers";
import { useEffect, useState } from "react";
import { readDataFile } from "@/lib/tauri";

import type { Bill } from "@/types";
import BillItemForm from "./details-form";

export default function BillDetails() {
	const billMeta = useAtomValue(billMetaAtom);
	const [bill, setBill] = useState<Partial<Bill> | null>(null);

	useEffect(() => {
		if (billMeta.isNew) return setBill({ id: billMeta.id });

		readDataFile<Bill>("bills", `${billMeta.id}.json`).then((bill) => {
			setBill(bill);
		});
	}, [billMeta]);

	return <BillItemForm bill={bill} />;
}
