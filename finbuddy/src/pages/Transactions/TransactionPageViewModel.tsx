import React, { useMemo, useState, useEffect } from "react";
import { useTransactionsStore } from "../../store/transactionStore"; // Ajuste o caminho
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { firestoreTimestampToDate } from "./components/TransactionDetailsModal/utils/transactionUtils";
import { useCategoriesStore } from "../../store/categoriesStore";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

export const useTransactionsPageViewModel = () => {
  type TransactionTypeFilter = "all" | "INCOME" | "EXPENSE";

  const { transactions, isLoading, fetchTransactions } = useTransactionsStore();
  const [filterType, setFilterType] = useState<TransactionTypeFilter>("all");
  const [searchText, setSearchText] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState(dayjs());
  const { fetchCategories } = useCategoriesStore();

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => prev.add(1, "month"));
  };

  const filteredTransactions = useMemo(() => {
    console.log(transactions);
    return transactions.filter((transaction) => {
      const transactionDate = firestoreTimestampToDate(transaction.date);
      if (!transactionDate) return false;
      const transactionDateDayjs = dayjs(transactionDate);

      const matchesMonth =
        transactionDateDayjs.isValid() &&
        transactionDateDayjs.year() === selectedMonth.year() &&
        transactionDateDayjs.month() === selectedMonth.month();

      const matchesFilter =
        filterType === "all" ||
        (filterType === "INCOME" && transaction.type === "INCOME") ||
        (filterType === "EXPENSE" && transaction.type === "EXPENSE");

      const matchesSearch =
        searchText === "" ||
        transaction.name.toLowerCase().includes(searchText.toLowerCase()) ||
        (transaction.category &&
          transaction.category
            .toLowerCase()
            .includes(searchText.toLowerCase()));

      return matchesMonth && matchesFilter && matchesSearch;
    });
  }, [transactions, filterType, searchText, selectedMonth]);

  const handleFilterChange = (newFilter: TransactionTypeFilter) => {
    setFilterType(newFilter);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  // Função que será chamada pelo TransactionListByDay para recarregar os dados
  const handleDataChange = () => {
    fetchTransactions();
  };
  return {
    handlePreviousMonth,
    selectedMonth,
    handleNextMonth,
    searchText,
    handleSearchChange,
    handleFilterChange,
    filterType,
    filteredTransactions,
    isLoading,
    handleDataChange,
  };
};
