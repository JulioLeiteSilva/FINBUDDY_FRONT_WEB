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
import { useBankAccountViewModel } from "./BankAccountViewModel";

import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import isBetween from 'dayjs/plugin/isBetween';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import BankAccountListView from "./components/BankAccountList/BankAccountListView";
import NewBankAccountModalView from "./components/NewBankAccountModal/NewBankAccountModalView";

const BankAccountsPage = () => {
    dayjs.extend(isBetween);
    dayjs.locale('pt-br');
    const {
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
        totalBalance,
        forecastTotalBalance,
        pastMonthTotalBalance
    } = useBankAccountViewModel();

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

                    {!isLoading && (
                        <Grid container spacing={2} mb={2}>
                            {showCurrentBalance && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Saldo Atual
                                            </Typography>
                                            <Typography variant="h5">
                                                R$ {totalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            )}

                            {showForecastBalance  && (
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Card>
                                        <CardContent>
                                            <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                                                Saldo Previsto
                                            </Typography>
                                            <Typography variant="h5">
                                                R$ {forecastTotalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                                                R$ {pastMonthTotalBalance.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
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
                        <BankAccountListView bankAccounts={filteredBankAccounts} selectedMonth={selectedMonth} />
                    )}
                </CardContent>
            </Card>
            {isModalOpen && (
                <NewBankAccountModalView
                    onClose={() => setIsModalOpen(false)}
                    onCreateNew={handleCreateNewAccount}
                />
            )}
        </Box>
    );
};

export default BankAccountsPage;
