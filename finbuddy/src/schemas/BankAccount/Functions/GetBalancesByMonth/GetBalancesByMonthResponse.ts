import z from "zod";
import { BankAccountSchema } from "../../BankAccount";
import { FunctionsGenericResponseSchema } from "../../../Common";

export const DataSchema = BankAccountSchema.pick({
    id: true,
    name: true,
    type: true,
    bank: true,
    balance: true,
    currency: true,
}).extend({
    forecastBankAccountBalance: z.number(),
    pastMonthBankAccountBalance: z.number(),
});

export type DataType = z.infer<typeof DataSchema>;

export const GetBalancesByMonthResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.object({
        accounts: z.array(DataSchema),
        totalBalance: z.number(),
        forecastTotalBalance: z.number(),
        pastMonthTotalBalance: z.number(),
    }),

});

export type GetBalancesByMonthResponseType = z.infer<typeof GetBalancesByMonthResponseSchema>;

export const BalancesByMonthSchema = GetBalancesByMonthResponseSchema.omit({
    message: true,
})

export type BalancesByMonthType = z.infer<typeof BalancesByMonthSchema>;