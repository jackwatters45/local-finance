"use client";

import { useAtom,  useSetAtom } from "jotai";
import { nanoid } from "nanoid";
import { useEffect } from "react";

import { budgetMetaAtom, budgetsAtom } from "@/app/providers";
import type{ Budget } from "@/types";
import { readAllFiles } from "@/lib/tauri";

import { columns } from "./columns";
import { DataTable } from "@/components/data-table/data-table";
import { OpenSidebarButton } from "@/components/ui/open-sidebar-button";
import { LoadingPage } from "@/components/ui/loading";
import BudgetDetails from "./details";

export default function Budgets() {
	const [budgets, setBudgets] = useAtom(budgetsAtom);
	useEffect(() => {
		readAllFiles<Budget>("budgets").then((budgets) => {
			budgets.sort((a, b) => a.date.getTime() - b.date.getTime());
			setBudgets(budgets);
		});
	}, [setBudgets]);

	const setBudgetMeta = useSetAtom(budgetMetaAtom);

	if (!budgets) return <LoadingPage />;

	return (
		<>
			<div className="space-y-4 pb-12 pt-24 ">
				<div className="flex items-center justify-between max-h-screen">
					<h2 className="text-xl font-semibold px-8">Budget</h2>
					<div className="pr-2">
						<OpenSidebarButton
							onClick={() => setBudgetMeta({ id: nanoid(), isNew: true })}
							sidebarContent={<BudgetDetails />}
						/>
					</div>
				</div>
				<DataTable columns={columns} data={budgets} />
			</div>
			<div className="hidden lg:block h-full border-l border-border py-12 relative ">
				<BudgetDetails />
			</div>
		</>
	);
}
