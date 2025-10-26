import { z } from "zod";

const DataSchema = z.object({
    month: z.string()
});

export const GetByMonthRequestSchema = DataSchema;

export type GetByMonthRequestType = z.infer<typeof GetByMonthRequestSchema>;