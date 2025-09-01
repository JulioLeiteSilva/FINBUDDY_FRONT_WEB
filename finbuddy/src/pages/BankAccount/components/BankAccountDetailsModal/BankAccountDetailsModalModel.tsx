import { BankAccountType, DeleteBankAccountRequestType, UpdateBankAccountRequestType } from "../../../../schemas/BankAccount";

export interface BankAccountDetailsModalProps {
    open: boolean;
    bankAccount: BankAccountType;
    onClose: () => void;
    onDelete: (body: DeleteBankAccountRequestType) => void;
    onUpdate: (body: UpdateBankAccountRequestType) => void;
}