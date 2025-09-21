import { useEffect } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useTransactionsStore } from "../../store/transactionStore";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { firestoreTimestampToDate } from "../Transactions/components/TransactionDetailsModal/utils/transactionUtils";
import { useBanks } from "../../hooks/useBanks";
import { formatCurrency } from "./utils/formatUtils";

export const useHomeViewModel = () => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const { bankAccountsBalancesByMonth, fetchBankAccountsBalancesByMonth } =
    useBankAccountStore();
  const { transactions, fetchTransactions } = useTransactionsStore();
  const { banks } = useBanks();
  const currentMonth = dayjs().tz("America/Sao_Paulo").format("YYYY-MM");

  useEffect(() => {
    fetchBankAccountsBalancesByMonth({ month: currentMonth });
    fetchTransactions();
  }, []);
  console.log(transactions)

  // Filtra transações da última semana
  const recentTransactions = transactions
    .filter((transaction) => {
      console.log(transaction)
      const transactionDate = firestoreTimestampToDate(transaction.date);
      console.log(transactionDate)
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
    console.log(recentTransactions)

  // Calcula totais para os cards
  const totalBalance = bankAccountsBalancesByMonth.data.totalBalance
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
    bankAccountsBalancesByMonth,
    transactions,
    banks,
  };
};
