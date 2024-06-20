import { useAtom } from "jotai";
import { transactionMetaAtom } from "../../providers";
import { useEffect, useState } from "react";
import { readDataFile } from "@/lib/tauri";
import TransactionForm from "./details-form";
import type { Transaction } from "@/types";

export default function TransactionDetails() {
	const [transactionId] = useAtom(transactionMetaAtom);
	const [transaction, setTransaction] = useState<Transaction | null>(null);

	useEffect(() => {
		if (!transactionId.id || transactionId.isNew) return setTransaction(null);

		readDataFile(`${transactionId.id}.json`).then((transaction) => {
			setTransaction(transaction);
		});
	}, [transactionId]);

	return <TransactionForm transaction={transaction} />;
}
