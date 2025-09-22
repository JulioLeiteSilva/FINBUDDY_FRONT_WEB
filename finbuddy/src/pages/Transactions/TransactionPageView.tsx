import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  InputAdornment,
  TextField,
  Typography,
  IconButton,
} from "@mui/material";
import TransactionListByDay from "./components/TransactionListByDay";
import { Search } from "@mui/icons-material";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import localizedFormat from "dayjs/plugin/localizedFormat";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useTransactionsPageViewModel } from "./TransactionPageViewModel";

dayjs.locale("pt-br");
dayjs.extend(localizedFormat);

const TransactionsPageView = () => {
  const {
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
  } = useTransactionsPageViewModel();

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      {" "}
      <Card sx={{ m: "auto", overflow: "visible" }}>
        {" "}
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom sx={{ mb: 3 }}>
            Histórico de Transações
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              mb: 2.5,
            }}
          >
            <IconButton onClick={handlePreviousMonth} aria-label="Mês anterior">
              <ChevronLeftIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                minWidth: { xs: "160px", sm: "200px" },
                textAlign: "center",
                textTransform: "capitalize",
              }}
            >
              {selectedMonth.format("MMMM [de] YYYY")}
            </Typography>
            <IconButton onClick={handleNextMonth} aria-label="Próximo mês">
              <ChevronRightIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
              mb: 2,
              alignItems: "center",
            }}
          >
            <TextField
              label="Pesquisar por nome ou categoria"
              variant="outlined"
              size="small"
              fullWidth
              value={searchText}
              onChange={handleSearchChange}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ flexGrow: 1 }}
            />
            <ButtonGroup
              variant="outlined"
              aria-label="Filtro de tipo de transação"
              size="small"
            >
              <Button
                onClick={() => handleFilterChange("all")}
                variant={filterType === "all" ? "contained" : "outlined"}
              >
                Todas
              </Button>
              <Button
                onClick={() => handleFilterChange("INCOME")}
                variant={filterType === "INCOME" ? "contained" : "outlined"}
              >
                Receitas
              </Button>
              <Button
                onClick={() => handleFilterChange("EXPENSE")}
                variant={filterType === "EXPENSE" ? "contained" : "outlined"}
              >
                Despesas
              </Button>
            </ButtonGroup>
          </Box>

          <TransactionListByDay
            transactions={filteredTransactions}
            isLoading={isLoading}
            onDataChange={handleDataChange}
          />
        </CardContent>
      </Card>
    </Box>
  );
};

export default TransactionsPageView;
