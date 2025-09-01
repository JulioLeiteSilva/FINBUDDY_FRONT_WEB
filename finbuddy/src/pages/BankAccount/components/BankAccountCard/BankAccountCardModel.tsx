import dayjs from "dayjs";
import { BalancesByMonthAccountType } from "../../../../schemas/BankAccount";

export interface BankAccountCardProps {
    bankAccount: BalancesByMonthAccountType;
    selectedMonth: dayjs.Dayjs;
}