import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { BankAccountSchemaType } from "../../../schemas/BankAccount";
import { useTransactionsStore } from "../../../store/transactionStore";
import { useMemo } from "react";

const getBankLogoUrl = (bankName: string) => {
    const domains: Record<string, string> = {
        itau: "itau.com.br",
        nubank: "nubank.com.br",
        bradesco: "bradesco.com.br",
        santander: "santander.com.br",
        caixa: "caixa.gov.br",
    };

    const key = bankName.toLowerCase().replace(/\s/g, "");
    const domain = domains[key];
    return domain ? `https://logo.clearbit.com/${domain}` : undefined;
};

interface BankAccountCardProps {
    bankAccount: BankAccountSchemaType;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({ bankAccount }) => {
    const { transactions } = useTransactionsStore();

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

    const logoUrl = getBankLogoUrl(bankAccount.bank);

    return (
        <Card sx={{ mb: 1, cursor: "pointer" }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    {logoUrl && (
                        <Avatar
                            src={logoUrl}
                            alt={bankAccount.bank}
                            sx={{ width: 40, height: 40 }}
                        />
                    )}
                    <Box>
                        <Typography variant="subtitle1" component="div">
                            {bankAccount.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                            {bankAccount.bank}
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
    );
};

export default BankAccountCard;
