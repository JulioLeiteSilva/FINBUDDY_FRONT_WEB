
import { z } from 'zod';
import { BankAccountSchema } from './bankAccountSchema';
import { UpdateBankAccountDTOSchema } from './updateBankAccountDTOSchema';
import { UpdateBankAccountBalanceDTOSchema } from './UpdateBankAccountBalanceDTOSchema';

export type BankAccountSchemaType = z.infer<typeof BankAccountSchema>;
export type CreateBankAccountDTOSchemaType = z.infer<typeof BankAccountSchema>;
export type UpdateBankAccountDTOSchemaType = z.infer<typeof UpdateBankAccountDTOSchema>;
export type UpdateBankAccountBalanceDTOSchemaType = z.infer<typeof UpdateBankAccountBalanceDTOSchema>;
export { BankAccountSchema, UpdateBankAccountDTOSchema, UpdateBankAccountBalanceDTOSchema };
