import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { BankAccountSchemaType, UpdateBankAccountDTOSchemaType } from "../../../schemas/BankAccount";
import { useTransactionsStore } from "../../../store/transactionStore";
import { useMemo, useState } from "react";
import { useBanks } from "../../../hooks/useBanks";
import BankAccountDetailsModal from "./bankAccountDetailsModal"; // ajuste o path se necessário
import { DeleteBankAccount, UpdateBankAccount } from "../../../services/BankAccount";

const BankAccountCard: React.FC<{ bankAccount: BankAccountSchemaType }> = ({ bankAccount }) => {
    const { transactions } = useTransactionsStore();
    const { banks } = useBanks();
    const [openModal, setOpenModal] = useState(false);

    const relatedTransactions = useMemo(() => {
        return transactions.filter(
            (tx) => tx.bankAccountId === bankAccount.id && !tx.isPaid
        );
    }, [transactions, bankAccount.id]);

    const forecastDifference = relatedTransactions.reduce((acc, tx) => {
        const multiplier = tx.type === "INCOME" ? 1 : -1;
        return acc + tx.value * multiplier;
    }, 0);

    const forecastBalance = bankAccount.balance + forecastDifference;

    const formattedBalance = bankAccount.balance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const formattedForecast = forecastBalance.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });

    const matchedBank = banks.find((bank) => bank.code === bankAccount.bank);

    const handleDelete = async (id: string) => {
        await DeleteBankAccount(id);
        setOpenModal(false);
    };

    const handleUpdate = async (updated: UpdateBankAccountDTOSchemaType) => {
        await UpdateBankAccount({
            ...updated,
            id: bankAccount.id,
        });
        setOpenModal(false);
    };

    return (
        <>
            <Card sx={{ mb: 1, cursor: "pointer" }} onClick={() => setOpenModal(true)}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        {matchedBank && (
                            <Avatar
                                src={matchedBank.logoUrl}
                                alt={matchedBank.name}
                                sx={{ width: 40, height: 40 }}
                            />
                        )}
                        <Box>
                            <Typography variant="subtitle1" component="div">
                                {bankAccount.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                {matchedBank?.name || bankAccount.bank}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                            Saldo atual: {formattedBalance}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Saldo previsto: {formattedForecast}
                        </Typography>
                    </Box>
                </CardContent>
            </Card>

            <BankAccountDetailsModal
                open={openModal}
                bankAccount={bankAccount}
                onClose={() => setOpenModal(false)}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default BankAccountCard;
