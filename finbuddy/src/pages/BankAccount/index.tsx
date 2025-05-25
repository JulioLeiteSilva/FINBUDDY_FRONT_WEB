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
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useTransactionsStore } from "../../store/transactionStore";
import BankAccountList from "./components/BankAccountList";
import NewBankAccountModal from "./components/NewBankAccountModal"; // ajuste o caminho conforme sua pasta
import { CreateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { CreateBankAccount } from "../../services/BankAccount";


const BankAccountsPage = () => {
    const { bankAccounts, isLoading, fetchBankAccounts } = useBankAccountStore();
    const { transactions, fetchTransactions } = useTransactionsStore();

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

    useEffect(() => {
        fetchBankAccounts();
        fetchTransactions();
    }, [fetchBankAccounts, fetchTransactions]);

    const filteredBankAccounts = useMemo(() => {
        return bankAccounts.filter((account) => {
            const matchesSearch =
                searchText === "" ||
                account.name.toLowerCase().includes(searchText.toLowerCase());
            return matchesSearch;
        });
    }, [bankAccounts, searchText]);

    const totalBalance = useMemo(() => {
        return bankAccounts.reduce((acc, account) => acc + account.balance, 0);
    }, [bankAccounts]);

    const forecastDifference = useMemo(() => {
        return transactions.reduce((acc, tx) => {
            if (tx.isPaid) return acc;
            const multiplier = tx.type === "INCOME" ? 1 : -1;
            return acc + tx.value * multiplier;
        }, 0);
    }, [transactions]);

    const forecastBalance = totalBalance + forecastDifference;

    return (
        <Box sx={{ p: 5 }}>
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

                    <Grid container spacing={2} mb={2}>
                        <Grid>
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
                        <Grid>
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
                    </Grid>

                    <TextField
                        label="Pesquisar Conta"
                        variant="outlined"
                        size="small"
                        fullWidth
                        margin="dense"
                        value={searchText}
                        onChange={handleSearchChange}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    {isLoading ? (
                        <>
                            {[...Array(5)].map((_, idx) => (
                                <Skeleton key={idx} variant="rectangular" height={60} sx={{ my: 1, borderRadius: 1 }} />
                            ))}
                        </>
                    ) : (
                        <BankAccountList bankAccounts={filteredBankAccounts} />
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
