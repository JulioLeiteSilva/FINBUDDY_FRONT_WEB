
import { z } from 'zod';
import { BankAccountSchema } from './BankAccountSchema';
import { CreateBankAccountDTOSchema } from './CreateBankAccountDTOSchema';
import { UpdateBankAccountDTOSchema } from './UpdateBankAccountDTOSchema';
import { UpdateBankAccountBalanceDTOSchema } from './UpdateBankAccountBalanceDTOSchema';
import { BankAccountResponseDTOSchema } from './BankAccountResponseDTOSchema';

export type BankAccountSchemaType = z.infer<typeof BankAccountSchema>;
export type BankAccountResponseDTOSchemaType = z.infer<typeof BankAccountResponseDTOSchema>;
export type CreateBankAccountDTOSchemaType = z.infer<typeof CreateBankAccountDTOSchema>;
export type UpdateBankAccountDTOSchemaType = z.infer<typeof UpdateBankAccountDTOSchema>;
export type UpdateBankAccountBalanceDTOSchemaType = z.infer<typeof UpdateBankAccountBalanceDTOSchema>;
export { BankAccountSchema, UpdateBankAccountDTOSchema, UpdateBankAccountBalanceDTOSchema, BankAccountResponseDTOSchema };
