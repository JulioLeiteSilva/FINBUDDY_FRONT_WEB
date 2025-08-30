import { z } from "zod";
import { BankAccountSchema } from "./BankAccountSchema";

export const TransformedBankAccountSchema = BankAccountSchema.transform(
  (data) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { createdAt, updatedAt, isActive, ...rest } = data;

    return {
      ...rest,
      forecastBankAccountBalance: z.number(),
    };
  }
);

export const BankAccountBalancesByMonthSchema = z.object({
  accounts: z.array(TransformedBankAccountSchema),
  totalBalance: z.number(),
  forecastTotalBalance: z.number(),
});

export const GetBalancesByMonthResponseSchema = z.object({
  message: z.string(),
  data: BankAccountBalancesByMonthSchema,
});
