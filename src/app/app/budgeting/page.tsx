"use client";

import { DataTable } from "@/components/data-table/data-table";
import { OpenSidebarButton } from "@/components/ui/open-sidebar-button";
import { columns } from "../transactions/columns";
import { useAtomValue } from "jotai";
import { transactionsAtom } from "@/app/providers";

export default function Budgeting() {
	const transactions = useAtomValue(transactionsAtom);

	return (
		<>
			<div className="space-y-4 pb-12 pt-24 ">
				<div className="flex items-center justify-between max-h-screen">
					<h2 className="text-xl font-semibold px-8">Transactions</h2>
					<div className="pr-2">
						{/* TODO update */}
						<OpenSidebarButton onClick={() => {}} sidebarContent={<div />} />
					</div>
				</div>
				{/* TODO update */}
				<DataTable columns={columns} data={transactions} />
			</div>
			<div className="hidden lg:block h-full border-l border-border py-12 relative ">
				{/* <TransactionDetails /> */}
			</div>
		</>
	);
}
