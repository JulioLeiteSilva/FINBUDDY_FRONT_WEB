import z from "zod";
import { FunctionsGenericRequestSchema } from "../../../Common";

export const GetBalancesByMonthRequestSchema = FunctionsGenericRequestSchema.extend({
    data: z.object({
        month: z.string(),
    })
});

export type GetBalancesByMonthRequestType = z.infer<typeof GetBalancesByMonthRequestSchema>;