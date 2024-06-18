import { useAtomValue } from "jotai";
import { selectedTransactionIdAtom } from "../providers";
import type { Transaction } from "@/types";
import { useEffect, useState } from "react";
import { readTransactionData } from "@/lib/tauri";
import TransactionForm from "./details-form";

export default function TransactionDetails() {
	const transactionId = useAtomValue(selectedTransactionIdAtom);
	const [transaction, setTransaction] = useState<null | Transaction>(null);

	useEffect(() => {
		if (!transactionId) return setTransaction(null);
		readTransactionData(`${transactionId}.json`).then((transaction) => {
			setTransaction(transaction);
		});
	}, [transactionId]);

	useEffect(() => {
		console.log("transactionId", transactionId);
	}, [transactionId]);
	useEffect(() => {
		console.log("transaction", transaction);
	}, [transaction]);

	if (!transaction && transactionId) return null;

	return <TransactionForm transaction={transaction} />;
}
