import { useAtomValue } from "jotai";
import { budgetMetaAtom } from "../../providers";
import { useEffect, useState } from "react";
import { readDataFile } from "@/lib/tauri";

import type { Budget } from "@/types";
import BudgetItemForm from "./details-form";

export default function BudgetDetails() {
	const budgetMeta = useAtomValue(budgetMetaAtom);
	const [budget, setBudget] = useState< Partial<Budget> | null>(null);

	useEffect(() => {
		if (budgetMeta.isNew) return setBudget({ id: budgetMeta.id });

		readDataFile<Budget>("budgets", `${budgetMeta.id}.json`).then((budget) => {
			setBudget(budget);
		});
	}, [budgetMeta]);

	return <BudgetItemForm budget={budget} />;
}
