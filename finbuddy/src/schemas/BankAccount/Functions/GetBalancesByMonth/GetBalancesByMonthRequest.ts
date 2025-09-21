import z from "zod";

export const GetBalancesByMonthRequestSchema = z.object({
    month: z.string(),
});

export type GetBalancesByMonthRequestType = z.infer<typeof GetBalancesByMonthRequestSchema>;