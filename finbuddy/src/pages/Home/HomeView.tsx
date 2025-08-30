import { Container, Grid } from '@mui/material';
import SummaryCards from './components/SummaryCards';
import BankAccountsList from './components/BankAccountsList';
import RecentTransactions from './components/RecentTransactions';
import { useHomeViewModel } from './HomeViewModel';

const HomeView = () => {
    const {
        totalBalance,
        monthlyIncome,
        monthlyExpenses,
        recentTransactions,
        formatCurrency,
        bankAccountBalancesByMonth,
        banks,
    } = useHomeViewModel();

    return (
        <Container sx={{ mt: 4, mb: 4 }}>
            <SummaryCards
                totalBalance={totalBalance}
                monthlyIncome={monthlyIncome}
                monthlyExpenses={monthlyExpenses}
                formatCurrency={formatCurrency}
            />

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <BankAccountsList
                        bankAccounts={bankAccountBalancesByMonth.accounts}
                        banks={banks}
                        formatCurrency={formatCurrency}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6 }}>
                    <RecentTransactions
                        transactions={recentTransactions}
                        formatCurrency={formatCurrency}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
export default HomeView;
