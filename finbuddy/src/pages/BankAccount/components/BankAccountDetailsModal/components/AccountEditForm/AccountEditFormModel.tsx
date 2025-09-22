import { Control, UseFormRegister, FieldErrors } from "react-hook-form";
import { Bank } from "../../../../../../hooks/useBanks";
import { UpdateBankAccountSchemaType } from "../../../../../../schemas/BankAccount";

export interface AccountEditFormProps {
    control: Control<UpdateBankAccountSchemaType>;
    register: UseFormRegister<UpdateBankAccountSchemaType>;
    errors: FieldErrors<UpdateBankAccountSchemaType>;
    banks: Bank[];
}