import { z } from "zod";

export const scheduleSchema = z.object({
	num: z.number().nullable(),
	range: z.string().nullable(),
});
