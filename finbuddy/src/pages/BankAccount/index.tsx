/* eslint-disable @typescript-eslint/no-unused-vars */
import { Search, Add } from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    Grid,
    Skeleton,
    Button,
    IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState, useCallback } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useTransactionsStore } from "../../store/transactionStore";
import BankAccountList from "./components/BankAccountList";
import NewBankAccountModal from "./components/NewBankAccountModal";
import { CreateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { CreateBankAccount } from "../../services/BankAccount";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import isBetween from 'dayjs/plugin/isBetween';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { firestoreTimestampToDate } from "../../pages/Transactions/components/TransactionDetailsModal/utils/transactionUtils";

const BankAccountsPage = () => {
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

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
            <Card sx={{ minWidth: 900 }}>
                <CardContent>
                    <Grid container justifyContent="space-between" alignItems="center" mb={2}>
                        <Grid>
                            <Typography variant="h6">
                                Suas Contas
                            </Typography>
                        </Grid>
                        <Grid>
                            <Button
                                variant="contained"
                                startIcon={<Add />}
                                onClick={handleAddAccount}
                            >
                                Adicionar Conta
                            </Button>
                        </Grid>
                    </Grid>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2.5 }}>
                        <IconButton onClick={handlePreviousMonth} aria-label="Mês anterior">
                            <ChevronLeftIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ minWidth: { xs: '160px', sm: '200px' }, textAlign: 'center', textTransform: 'capitalize' }}>
                            {selectedMonth.format('MMMM [de] YYYY')}
                        </Typography>
                        <IconButton onClick={handleNextMonth} aria-label="Próximo mês">
                            <ChevronRightIcon />
                        </IconButton>
                    </Box>

                    {!isTransactionsLoading && (
                        <Grid container spacing={2} mb={2}>
                            {showCurrentBalance && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Saldo Total
                                            </Typography>
                                            <Typography variant="h5">
                                                R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {showForecastBalance && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Saldo Previsto
                                            </Typography>
                                            <Typography variant="h5">
                                                R$ {forecastBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {showPastMonthBalance && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Saldo no final do mês
                                            </Typography>
                                            <Typography variant="h5">
                                                R$ {pastMonthBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}
                        </Grid>
                    )}

                    <TextField label="Pesquisar Conta" variant="outlined" size="small" fullWidth margin="dense" value={searchText} onChange={handleSearchChange} InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <Search />
                            </InputAdornment>
                        ),
                    }} />

                    {isLoading ? (
                        <>
                            {[...Array(5)].map((_, idx) => (
                                <Skeleton key={idx} variant="rectangular" height={60} sx={{ my: 1, borderRadius: 1 }} />
                            ))}
                        </>
                    ) : (
                        <BankAccountList bankAccounts={filteredBankAccounts} selectedMonth={selectedMonth} />
                    )}
                </CardContent>
            </Card>
            {isModalOpen && (
                <NewBankAccountModal
                    onClose={() => setIsModalOpen(false)}
                    onCreateNew={handleCreateNewAccount}
                />
            )}
        </Box>
    );
};

export default BankAccountsPage;
