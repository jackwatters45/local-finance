export type Transaction = {
	id: string;
	date: Date;
	name: string;
	amount: number;
	category: string; // TODO
	tags: string[]; // TODO
	recurring: boolean;
	notes: string;
	// history: string; // TODO
};
