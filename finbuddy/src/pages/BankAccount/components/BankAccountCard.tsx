import { Avatar, Card, CardContent, Typography, Box } from "@mui/material";
import { BankAccountSchemaType, UpdateBankAccountDTOSchemaType } from "../../../schemas/BankAccount";
import { useTransactionsStore } from "../../../store/transactionStore";
import { useMemo, useState } from "react";
import { useBanks } from "../../../hooks/useBanks";
import { BankAccountDetailsModal } from "./BankAccountDetailsModal";
import { DeleteBankAccount, UpdateBankAccount } from "../../../services/BankAccount";
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { firestoreTimestampToDate } from "../../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils";

interface BankAccountCardProps {
    bankAccount: BankAccountSchemaType;
    selectedMonth: dayjs.Dayjs;
}

const BankAccountCard: React.FC<BankAccountCardProps> = ({ bankAccount, selectedMonth }) => {
    const { transactions } = useTransactionsStore();
    const { banks } = useBanks();
    const [openModal, setOpenModal] = useState(false);

    dayjs.extend(isSameOrBefore)

    const balanceInfo = useMemo(() => {
        const today = dayjs();
        const endOfSelectedMonth = selectedMonth.endOf('month');

        const isCurrentMonth = selectedMonth.isSame(today, 'month');
        const isFutureMonth = selectedMonth.isAfter(today, 'month');
        // Garantindo que isPastMonth seja estritamente passado e não o mês atual
        const isPastMonth = selectedMonth.isBefore(today, 'month') && !selectedMonth.isSame(today, 'month');


        // Valores padrão - para o mês atual ou se não for passado/futuro específico
        let mainDisplayBalance = bankAccount.balance;
        let mainDisplayLabel = "Saldo Atual";
        let forecastDisplayBalance: number | null = null;

        if (isPastMonth) {
            mainDisplayLabel = "Saldo no final do mês";
            let calculatedPastBalance = bankAccount.balance; // Começa com o saldo atual

            // Filtra transações PAGAS desta conta que ocorreram APÓS o mês passado selecionado e ATÉ hoje
            // para reverter seus efeitos e encontrar o saldo no final do mês passado.
            transactions
                .filter(tx => {
                    if (tx.bankAccountId !== bankAccount.id || !tx.isPaid) return false;
                    const txDateObj = firestoreTimestampToDate(tx.date);
                    if (!txDateObj) return false;
                    const txDate = dayjs(txDateObj);
                    // Transações entre o fim do mês passado selecionado e hoje
                    return txDate.isValid() && txDate.isAfter(endOfSelectedMonth) && txDate.isSameOrBefore(today);
                })
                .forEach(tx => {
                    // Reverte a transação: soma despesas, subtrai receitas
                    calculatedPastBalance += (tx.type === "EXPENSE" ? tx.value : -tx.value);
                });
            mainDisplayBalance = calculatedPastBalance;

        } else if (isCurrentMonth) {
            // Para o mês atual, mainDisplayBalance é o saldo atual da conta.
            // mainDisplayLabel já é "Saldo Atual".
            let currentForecast = bankAccount.balance; // Começa com o saldo atual

            // Filtra transações NÃO PAGAS desta conta que pertencem ao MÊS ATUAL selecionado
            transactions
                .filter(tx => {
                    if (tx.bankAccountId !== bankAccount.id || tx.isPaid) return false; // Apenas não pagas
                    const txDateObj = firestoreTimestampToDate(tx.date);
                    if (!txDateObj) return false;
                    const txDate = dayjs(txDateObj);
                    // Transações do mês atual selecionado
                    return txDate.isValid() && txDate.isSame(selectedMonth, 'month');
                })
                .forEach(tx => {
                    // Aplica a transação: soma receitas, subtrai despesas
                    currentForecast += (tx.type === "INCOME" ? tx.value : -tx.value);
                });
            forecastDisplayBalance = currentForecast;

        } else if (isFutureMonth) {
            // Para meses futuros, mainDisplayBalance é o saldo atual da conta.
            // mainDisplayLabel já é "Saldo Atual".
            let futureForecast = bankAccount.balance; // Começa com o saldo atual

            // Filtra TODAS as transações (pagas ou não pagas, pois são projeções)
            // desta conta que pertencem ao MÊS FUTURO selecionado.
            transactions
                .filter(tx => {
                    if (tx.bankAccountId !== bankAccount.id) return false; // Todas para esta conta
                    const txDateObj = firestoreTimestampToDate(tx.date);
                    if (!txDateObj) return false;
                    const txDate = dayjs(txDateObj);
                    // Transações do mês futuro selecionado
                    return txDate.isValid() && txDate.isSame(selectedMonth, 'month');
                })
                .forEach(tx => {
                    // Aplica a transação: soma receitas, subtrai despesas
                    futureForecast += (tx.type === "INCOME" ? tx.value : -tx.value);
                });
            forecastDisplayBalance = futureForecast;
        }

        return {
            mainBalance: mainDisplayBalance,
            mainLabel: mainDisplayLabel,
            forecastBalance: forecastDisplayBalance,
            // Mostra o forecast se for mês atual ou futuro E houver um valor calculado
            showForecast: (isCurrentMonth || isFutureMonth) && forecastDisplayBalance !== null,
        };
        // As dependências devem incluir todas as variáveis externas que, se alteradas,
        // deveriam recalcular o memo. `today` é recalculado a cada render se não estiver
        // estável ou vindo de fora. Se `selectedMonth` puder ser o dia atual por padrão,
        // a dependência em `selectedMonth` pode ser suficiente para cobrir mudanças de dia.
    }, [bankAccount, transactions, selectedMonth]);

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
                            {balanceInfo.mainLabel}: {balanceInfo.mainBalance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                        </Typography>
                        {balanceInfo.showForecast && balanceInfo.forecastBalance !== null && (
                            <Typography variant="body2" color="text.secondary">
                                Saldo previsto: {balanceInfo.forecastBalance.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </Typography>
                        )}
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
