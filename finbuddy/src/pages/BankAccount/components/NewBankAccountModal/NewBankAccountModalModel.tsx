import { CreateBankAccountRequestType } from "../../../../schemas/BankAccount";

export interface NewBankAccountModalProps {
    onClose: () => void;
    onCreateNew: (body: CreateBankAccountRequestType) => void;
}