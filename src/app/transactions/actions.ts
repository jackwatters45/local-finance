"use server";

export async function changeDate(id: string, date: Date) {
	// write to file...
	console.log("changeDate", date);
	return "date ?? new Date();";
}
