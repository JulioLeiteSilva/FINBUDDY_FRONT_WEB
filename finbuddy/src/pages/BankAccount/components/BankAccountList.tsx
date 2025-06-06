import { List } from "@mui/material";
import { BankAccountSchemaType } from "../../../schemas/BankAccount";
import BankAccountCard from "./BankAccountCard";
import dayjs from "dayjs";

interface BankAccountListProps {
    bankAccounts: BankAccountSchemaType[];
    selectedMonth: dayjs.Dayjs;
}

const BankAccountList: React.FC<BankAccountListProps> = ({ bankAccounts, selectedMonth }) => {
    return (
        <List>
            {bankAccounts.map((bankAccount) => (
                <BankAccountCard key={bankAccount.id} bankAccount={bankAccount} selectedMonth={selectedMonth} />
            ))}
        </List>
    );
};
export default BankAccountList;