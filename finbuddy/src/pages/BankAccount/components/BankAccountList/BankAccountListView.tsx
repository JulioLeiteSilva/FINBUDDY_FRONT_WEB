import { List } from "@mui/material";
import { BankAccountListProps } from "./BankAccountListModel";
import { BankAccountCardView } from "../BankAccountCard/BankAccountCardView";

const BankAccountListView = (props: BankAccountListProps) => {
    const { bankAccounts, selectedMonth } = props
    return (
        <List>
            {bankAccounts.map((bankAccount) => (
                <BankAccountCardView key={bankAccount.id} bankAccount={bankAccount} selectedMonth={selectedMonth} />
            ))}
        </List>
    );
}
export default BankAccountListView;