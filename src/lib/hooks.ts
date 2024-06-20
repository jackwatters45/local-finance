import { useAtom, useSetAtom } from "jotai";
import React from "react";

import { writeDataFile } from "./tauri";
import { transactionMetaAtom, transactionsAtom } from "@/app/providers";
import { getDefaultTransaction } from "@/app/app/transactions/details-form";
import type { Transaction } from "@/types";

export function useMirroredWidth(): [React.RefObject<HTMLElement>, number] {
	const ref = React.useRef<HTMLElement>(null);
	const [width, setWidth] = React.useState(0);
	React.useEffect(() => {
		const handleResize = () => {
			if (ref.current) setWidth(ref.current.offsetWidth);
		};

		handleResize();

		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return [ref, width];
}

export const useUpdateTransaction = () => {
	const setTransactions = useSetAtom(transactionsAtom);
	const [transactionMeta, setTransactonMeta] = useAtom(transactionMetaAtom);

	return (id: string, data: Partial<Transaction>) => {
		if (transactionMeta.isNew) {
			const newTransaction = getDefaultTransaction({ id, ...data });

			setTransactonMeta({ id });

			setTransactions((transactions) => {
				return [...transactions, newTransaction];
			});

			return writeDataFile(`${id}.json`, newTransaction);
		}

		setTransactions((transactions) => {
			return transactions.map((transaction) => {
				if (transaction.id !== id) return transaction;

				const newData = { ...transaction, ...data };

				writeDataFile(`${id}.json`, newData);
				return newData;
			});
		});
	};
};
