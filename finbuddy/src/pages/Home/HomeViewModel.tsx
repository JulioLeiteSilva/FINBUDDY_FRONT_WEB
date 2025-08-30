import { useEffect } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useTransactionsStore } from "../../store/transactionStore";
import dayjs from "dayjs";
import { firestoreTimestampToDate } from "../Transactions/components/TransactionDetailsModal/utils/transactionUtils";
import { useBanks } from "../../hooks/useBanks";
import { formatCurrency } from "./utils/formatUtils";

export const useHomeViewModel = () => {
  const { bankAccountBalancesByMonth, fetchBankAccountsBalancesByMonth } =
    useBankAccountStore();
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { banks } = useBanks();
  const currentMonth = dayjs().format("YYYY-MM");

  useEffect(() => {
    fetchBankAccountsBalancesByMonth({ month: currentMonth });
    fetchTransactions();
  }, []);
  console.log(transactions)

  // Filtra transações da última semana
  const recentTransactions = transactions
    .filter((transaction) => {
      const transactionDate = firestoreTimestampToDate(transaction.date);
      if (!transactionDate) return false;
      const txDate = dayjs(transactionDate);
      const oneWeekAgo = dayjs().subtract(7, "day");
      return txDate.isAfter(oneWeekAgo);
    })
    .sort((a, b) => {
      const dateA = firestoreTimestampToDate(a.date);
      const dateB = firestoreTimestampToDate(b.date);
      return (dateA?.getTime() ?? 0) - (dateB?.getTime() ?? 0);
    })
    .slice(0, 5); // Pega apenas as 5 transações mais recentes

    console.log(bankAccountBalancesByMonth)
  // Calcula totais para os cards
  const totalBalance = bankAccountBalancesByMonth.totalBalance
  const monthlyIncome = transactions
    .filter((tx) => {
      const txDate = firestoreTimestampToDate(tx.date);
      return (
        txDate &&
        dayjs(txDate).isSame(dayjs(), "month") &&
        tx.type === "INCOME" &&
        tx.isPaid
      );
    })
    .reduce((sum, tx) => sum + tx.value, 0);
  const monthlyExpenses = transactions
    .filter((tx) => {
      const txDate = firestoreTimestampToDate(tx.date);
      return (
        txDate &&
        dayjs(txDate).isSame(dayjs(), "month") &&
        tx.type === "EXPENSE" &&
        tx.isPaid
      );
    })
    .reduce((sum, tx) => sum + tx.value, 0);
  return {
    totalBalance,
    monthlyIncome,
    monthlyExpenses,
    recentTransactions,
    formatCurrency,
    bankAccountBalancesByMonth,
    transactions,
    banks,
  };
};
