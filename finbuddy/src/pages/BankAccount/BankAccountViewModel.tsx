/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useMemo, useState, useCallback } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useTransactionsStore } from "../../store/transactionStore";
import { CreateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { CreateBankAccount } from "../../services/BankAccount";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import isBetween from 'dayjs/plugin/isBetween';
import { firestoreTimestampToDate } from "../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils";

export const useBankAccountViewModel = () => {
    dayjs.extend(isBetween);
    const { bankAccounts, isLoading, fetchBankAccounts } = useBankAccountStore();
    const { transactions, fetchTransactions, isLoading: isTransactionsLoading } = useTransactionsStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState<string>("");


    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleAddAccount = () => {
        setIsModalOpen(true);
    };

    const handleCreateNewAccount = (newAccount: CreateBankAccountDTOSchemaType) => {
        CreateBankAccount(newAccount);
        setIsModalOpen(false);
    };
    const [selectedMonth, setSelectedMonth] = useState(dayjs());

    useEffect(() => {
        fetchBankAccounts();
        fetchTransactions();
    }, [fetchBankAccounts, fetchTransactions, selectedMonth]);


    const filteredBankAccounts = useMemo(() => {
        return bankAccounts.filter((account) => {
            const matchesSearch =
                searchText === "" ||
                account.name.toLowerCase().includes(searchText.toLowerCase());
            return matchesSearch;
        });
    }, [bankAccounts, searchText]);

    const calculateBalances = useCallback(() => {
        let totalBalance = 0;
        let projectedChangeForSelectedMonth = 0;
        let netActivityForPastMonth = 0;

        bankAccounts.forEach(account => {
            totalBalance += account.balance;
        });

        const currentMonth = dayjs();
        const isCurrentMonth = selectedMonth.isSame(currentMonth, 'month');
        const isFutureMonth = selectedMonth.isAfter(currentMonth, 'month');
        const isPastMonth = selectedMonth.isBefore(currentMonth, 'month');

        const monthStart = selectedMonth.startOf('month');
        const monthEnd = selectedMonth.endOf('month');

        transactions.forEach(tx => {
            const transactionDate = firestoreTimestampToDate(tx.date);
            if (!transactionDate) return;
            const txDate = dayjs(transactionDate);

            if (!txDate.isBetween(monthStart, monthEnd, 'day', '[]')) {
                return;
            }

            const multiplier = tx.type === "INCOME" ? 1 : -1;

            if (isCurrentMonth) {
                if (!tx.isPaid) {
                    projectedChangeForSelectedMonth += tx.value * multiplier;
                }
            } else if (isFutureMonth) {
                projectedChangeForSelectedMonth += tx.value * multiplier;
            } else if (isPastMonth) {
                if (tx.isPaid) {
                    netActivityForPastMonth += tx.value * multiplier;
                }
            }
        });

        let finalForecastBalance;
        if (isCurrentMonth || isFutureMonth) {
            finalForecastBalance = totalBalance + projectedChangeForSelectedMonth;
        } else {
            finalForecastBalance = totalBalance;
        }

        return {
            totalBalance,
            forecastBalance: finalForecastBalance,
            pastMonthBalance: netActivityForPastMonth,
            showCurrentBalance: isCurrentMonth,
            showForecastBalance: isCurrentMonth || isFutureMonth,
            showPastMonthBalance: isPastMonth,
        };
    }, [bankAccounts, transactions, selectedMonth]);

    const {
        totalBalance,
        forecastBalance,
        pastMonthBalance,
        showCurrentBalance,
        showForecastBalance,
        showPastMonthBalance,
    } = useMemo(() => calculateBalances(), [calculateBalances]);

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => prev.add(1, 'month'));
    };

    return {
        isLoading,
        isTransactionsLoading,
        isModalOpen,
        searchText,
        setIsModalOpen,
        handleSearchChange,
        handleAddAccount,
        handleCreateNewAccount,
        selectedMonth,
        setSelectedMonth,
        filteredBankAccounts,
        handlePreviousMonth,
        handleNextMonth,
        totalBalance,
        forecastBalance,
        pastMonthBalance,
        showCurrentBalance,
        showForecastBalance,
        showPastMonthBalance,
    }
}