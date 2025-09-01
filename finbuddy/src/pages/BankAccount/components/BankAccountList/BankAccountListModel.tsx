import dayjs from "dayjs";
import { BalancesByMonthAccountType } from "../../../../schemas/BankAccount";

export interface BankAccountListProps {
    bankAccounts: BalancesByMonthAccountType[];
    selectedMonth: dayjs.Dayjs;
}