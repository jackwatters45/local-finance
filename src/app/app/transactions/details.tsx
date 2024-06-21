import { useAtomValue } from "jotai";
import { transactionMetaAtom } from "../../providers";
import { useEffect, useState } from "react";
import { readDataFile } from "@/lib/tauri";
import TransactionForm from "./details-form";
import type { Transaction } from "@/types";

export default function TransactionDetails() {
	const transactionMeta = useAtomValue(transactionMetaAtom);
	const [transaction, setTransaction] = useState<Partial<Transaction> | null>(
		null,
	);

	useEffect(() => {
		if (transactionMeta.isNew) return setTransaction({ id: transactionMeta.id });

		readDataFile<Transaction>("transactions", `${transactionMeta.id}.json`).then(
			(transaction) => {
				setTransaction(transaction);
			},
		);
	}, [transactionMeta]);

	return <TransactionForm transaction={transaction} />;
}
