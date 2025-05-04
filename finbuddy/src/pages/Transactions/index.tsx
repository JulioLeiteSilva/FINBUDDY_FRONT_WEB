import { Box, Button, ButtonGroup, Card, CardContent, InputAdornment, Skeleton, TextField, Typography } from "@mui/material";
import TransactionListByDay from "../../components/transactionListByDay";
import { useMemo, useState, useEffect } from "react";
import { useTransactionsStore } from "../../store/transactionStore";
import { Search } from "@mui/icons-material";

type TransactionType = 'all' | 'INCOME' | 'EXPENSE';

const TransactionsPage = () => {
    const { transactions, isLoading, fetchTransactions } = useTransactionsStore();
    const [filterType, setFilterType] = useState<TransactionType>('all');
    const [searchText, setSearchText] = useState<string>('');

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesFilter =
                filterType === 'all' ||
                (filterType === 'INCOME' && transaction.type === 'INCOME') ||
                (filterType === 'EXPENSE' && transaction.type === 'EXPENSE');

            const matchesSearch =
                searchText === '' ||
                transaction.name.toLowerCase().includes(searchText.toLowerCase());

            return matchesFilter && matchesSearch;
        });
    }, [transactions, filterType, searchText]);

    const handleFilterChange = (newFilter: TransactionType) => {
        setFilterType(newFilter);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.target.value);
    };

    return (
        <Box>
            <Card sx={{ minWidth: 900, m: 5 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Histórico de Transações
                    </Typography>
                    <TextField
                        label="Pesquisar Transação"
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="dense"
                        value={searchText}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <ButtonGroup variant="outlined" aria-label="transaction filter" sx={{ my: 2 }}>
                        <Button onClick={() => handleFilterChange('all')} disabled={filterType === 'all'}>
                            Todas
                        </Button>
                        <Button onClick={() => handleFilterChange('INCOME')} disabled={filterType === 'INCOME'}>
                            Receitas
                        </Button>
                        <Button onClick={() => handleFilterChange('EXPENSE')} disabled={filterType === 'EXPENSE'}>
                            Despesas
                        </Button>
                    </ButtonGroup>

                    {isLoading ? (
                        <>
                            {[...Array(5)].map((_, idx) => (
                                <Skeleton key={idx} variant="rectangular" height={60} sx={{ my: 1, borderRadius: 1 }} />
                            ))}
                        </>
                    ) : (
                        <TransactionListByDay transactions={filteredTransactions} />
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default TransactionsPage;
