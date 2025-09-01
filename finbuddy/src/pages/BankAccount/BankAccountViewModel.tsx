/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { CreateBankAccount } from "../../services/BankAccount";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isBetween from 'dayjs/plugin/isBetween';
import { CreateBankAccountRequestType } from "../../schemas/BankAccount";

export const useBankAccountViewModel = () => {
    dayjs.extend(isBetween);
    dayjs.locale('pt-br');
    dayjs.extend(utc);
    dayjs.extend(timezone);
    const { bankAccountsBalancesByMonth, isLoading, fetchBankAccountsBalancesByMonth } = useBankAccountStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedMonth, setSelectedMonth] = useState(dayjs().tz("America/Sao_Paulo"));
    const [totalBalance, setTotalBalance] = useState(0);
    const [forecastTotalBalance, setForecastTotalBalance] = useState(0);
    const [pastMonthTotalBalance, setPastMonthTotalBalance] = useState(0);
    const [showCurrentBalance, setShowCurrentBalance] = useState(true);
    const [showForecastBalance, setShowForecastBalance] = useState(true);
    const [showPastMonthBalance, setShowPastMonthBalance] = useState(false);
    const today = dayjs();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    const handleAddAccount = () => {
        setIsModalOpen(true);
    };

    const handleCreateNewAccount = (newAccount: CreateBankAccountRequestType) => {
        CreateBankAccount(newAccount);
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchBankAccountsBalancesByMonth({ data: { month: selectedMonth.format('YYYY-MM') } });
    }, [selectedMonth]);

    useEffect(() => {
        const { totalBalance, forecastTotalBalance, pastMonthTotalBalance } = bankAccountsBalancesByMonth.data
        const isCurrentMonth = selectedMonth.isSame(today, 'month');
        const isFutureMonth = selectedMonth.isAfter(today, 'month');
        const isPastMonth = selectedMonth.isBefore(today, 'month') && !selectedMonth.isSame(today, 'month');

        const showCurrentBalance = isCurrentMonth
        const showForecastBalance = (isCurrentMonth || isFutureMonth)
        const showPastMonthBalance = isPastMonth


        setTotalBalance(totalBalance)
        setForecastTotalBalance(forecastTotalBalance)
        setPastMonthTotalBalance(pastMonthTotalBalance)
        setShowCurrentBalance(showCurrentBalance)
        setShowForecastBalance(showForecastBalance)
        setShowPastMonthBalance(showPastMonthBalance)
    }, [bankAccountsBalancesByMonth])

    const filteredBankAccounts = useMemo(() => {
        return bankAccountsBalancesByMonth.data.accounts.filter((account) => {
            const matchesSearch =
                searchText === "" ||
                account.name.toLowerCase().includes(searchText.toLowerCase());
            return matchesSearch;
        });
    }, [bankAccountsBalancesByMonth.data.accounts, searchText]);

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => prev.add(1, 'month'));
    };

    return {
        isLoading,
        isModalOpen,
        searchText,
        setIsModalOpen,
        handleSearchChange,
        handleAddAccount,
        handleCreateNewAccount,
        selectedMonth,
        filteredBankAccounts,
        handlePreviousMonth,
        handleNextMonth,
        showCurrentBalance,
        showForecastBalance,
        showPastMonthBalance,
        bankAccountsBalancesByMonth,
        totalBalance,
        forecastTotalBalance,
        pastMonthTotalBalance
    }
}