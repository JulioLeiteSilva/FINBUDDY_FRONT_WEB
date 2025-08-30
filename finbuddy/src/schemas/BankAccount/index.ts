import { z } from "zod";
import { BankAccountSchema } from "./BankAccountSchema";
import { CreateBankAccountDTOSchema } from "./CreateBankAccountDTOSchema";
import { UpdateBankAccountDTOSchema } from "./UpdateBankAccountDTOSchema";
import { UpdateBankAccountBalanceDTOSchema } from "./UpdateBankAccountBalanceDTOSchema";
import { BankAccountResponseDTOSchema } from "./BankAccountResponseDTOSchema";
import {
  BankAccountBalancesByMonthSchema,
  GetBalancesByMonthResponseSchema,
  TransformedBankAccountSchema,
} from "./GetBalancesByMonthResponseSchema";
import { GetBalancesByMonthRequestSchema } from "./GetBalancesByMonthRequestSchema";

export type BankAccountSchemaType = z.infer<typeof BankAccountSchema>;
export type BankAccountResponseDTOSchemaType = z.infer<
  typeof BankAccountResponseDTOSchema
>;
export type CreateBankAccountDTOSchemaType = z.infer<
  typeof CreateBankAccountDTOSchema
>;
export type UpdateBankAccountDTOSchemaType = z.infer<
  typeof UpdateBankAccountDTOSchema
>;
export type UpdateBankAccountBalanceDTOSchemaType = z.infer<
  typeof UpdateBankAccountBalanceDTOSchema
>;
export type GetBalancesByMonthResponseSchemaType = z.infer<
  typeof GetBalancesByMonthResponseSchema
>;
export type GetBalancesByMonthRequestSchemaType = z.infer<
  typeof GetBalancesByMonthRequestSchema
>;
export type BankAccountBalancesByMonthSchemaType = z.infer<
  typeof BankAccountBalancesByMonthSchema
>;
export type TransformedBankAccountSchemaType = z.infer<
  typeof TransformedBankAccountSchema
>;

export {
  BankAccountSchema,
  UpdateBankAccountDTOSchema,
  UpdateBankAccountBalanceDTOSchema,
  BankAccountResponseDTOSchema,
  GetBalancesByMonthResponseSchema,
  GetBalancesByMonthRequestSchema,
  BankAccountBalancesByMonthSchema,
  TransformedBankAccountSchema,
};
