import { List } from "@mui/material";
import { BankAccountSchemaType } from "../../../schemas/BankAccount";
import BankAccountCard from "./bankAccountCard";

interface BankAccountListProps {
    bankAccounts: BankAccountSchemaType[];
}

const BankAccountList: React.FC<BankAccountListProps> = ({ bankAccounts }) => {
    return (
        <List>
            {bankAccounts.map((bankAccount) => (
                <BankAccountCard key={bankAccount.id} bankAccount={bankAccount} />
            ))}
        </List>
    );
};
export default BankAccountList;