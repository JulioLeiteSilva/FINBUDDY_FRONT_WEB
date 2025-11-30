import { z } from "zod";

const DataSchema = z.object({
    sourceMonth: z.string(),
    targetMonth: z.string(),
    adjustments: z.array(z.object({
        monthlyIncome: z.number(),
        budgetAmount: z.number(),
    })).optional(),
})

export const CopyFromMonthRequestSchema = DataSchema;

export type CopyFromMonthRequestType = z.infer<typeof CopyFromMonthRequestSchema>;