"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { nanoid } from "nanoid";

import { billMetaAtom, billsAtom } from "@/app/providers";
import { readAllFiles } from "@/lib/tauri";
import type { Bill } from "@/types";

import { DataTable } from "@/components/data-table/data-table";
import { OpenSidebarButton } from "@/components/ui/open-sidebar-button";
import { columns } from "./columns";
import BillDetails from "./details";
import { LoadingPage } from "@/components/ui/loading";

export default function Bills() {
	const [bills, setBills] = useAtom(billsAtom);
	useEffect(() => {
		readAllFiles<Bill>("bills").then((bills) => {
			bills.sort((a, b) => a.date.getTime() - b.date.getTime());
			setBills(bills);
		});
	}, [setBills]);

	const setBillMeta = useSetAtom(billMetaAtom);

	if (!bills) return <LoadingPage />;

	return (
		<>
			<div className="space-y-4 pb-12 pt-24 ">
				<div className="flex items-center justify-between max-h-screen">
					<h2 className="text-xl font-semibold px-8">Bills</h2>
					<div className="pr-2">
						<OpenSidebarButton
							onClick={() => setBillMeta({ id: nanoid(), isNew: true })}
							sidebarContent={<BillDetails />}
						/>
					</div>
				</div>
				<DataTable columns={columns} data={bills} />
			</div>
			<div className="hidden lg:block h-full border-l border-border py-12 relative ">
				<BillDetails />
			</div>
		</>
	);
}
