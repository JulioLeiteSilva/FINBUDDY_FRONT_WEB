import { Bank } from "../../../../../../hooks/useBanks";
import { BankAccountType } from "../../../../../../schemas/BankAccount";

export interface AccountDisplayInfoProps {
    bankAccount: BankAccountType;
    banks: Bank[];
}

export interface InfoRowProps {
    icon: React.ReactElement;
    label: string;
    value: React.ReactNode;
}