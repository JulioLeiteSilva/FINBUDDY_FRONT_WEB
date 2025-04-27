import { Box } from "@mui/material";

const TransactionsPage = () => {
    return (
        <Box>
            <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
                <h1>Transactions</h1>
                <p>Here you can view and manage your transactions.</p>
            </Box>
            <Box sx={{ padding: '20px' }}>
                {/* Add your transaction management components here */}
            </Box>
        </Box>
    );
}
export default TransactionsPage;