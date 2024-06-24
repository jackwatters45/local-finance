import { useAtom, useSetAtom } from "jotai";
import React from "react";

import { writeDataFile } from "./tauri";
import {
	billMetaAtom,
	billsAtom,
	budgetMetaAtom,
	budgetsAtom,
	transactionMetaAtom,
	transactionsAtom,
} from "@/app/providers";
import type { Bill, Budget, Subdirectory, Transaction } from "@/types";
import { getDefaultBill, getDefaultBudget, getDefaultTransaction } from "./utils";

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

const atomsMap = {
	transactions: {
		values: transactionsAtom,
		meta: transactionMetaAtom,
		default: getDefaultTransaction,
	},
	bills: {
		values: billsAtom,
		meta: billMetaAtom,
		default: getDefaultBill,
	},
	budgets: {
		values: budgetsAtom,
		meta: budgetMetaAtom,
		default: getDefaultBudget,
	},
};

export const useWriteInputToFile = (subdirectory: Subdirectory) => {
	const {
		values: valuesAtom,
		meta: metaAtom,
		default: getDefaultFunc,
	} = atomsMap[subdirectory];
	const setValues = useSetAtom(valuesAtom);
	const [Meta, setMeta] = useAtom(metaAtom);

	return (id: string, data: Partial<Transaction | Bill | Budget>) => {
		if (Meta.isNew) {
			const newValue = getDefaultFunc({ id, ...data });

			setMeta({ id });

			setValues((values: Transaction[] | Bill[] | Budget[]) => {
				return [...values, newValue];
			});

			return writeDataFile(subdirectory, `${id}.json`, newValue);
		}

		setValues((values: Transaction[] | Bill[] | Budget[]) => {
			return values.map((v) => {
				if (v.id !== id) return v;

				const newData = { ...v, ...data };

				writeDataFile(subdirectory, `${id}.json`, newData);
				return newData;
			});
		});
	};
};
