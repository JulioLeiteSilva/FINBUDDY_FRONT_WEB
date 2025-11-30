import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Avatar,
} from "@mui/material";
import {
  CreateTransactionType,
  TransactionType,
} from "../../../schemas/Transactions";
import { TransactionDetailsModal } from "./TransactionDetailsModal";
import {
  DeleteTransaction,
  UpdateTransaction,
} from "../../../services/Transactions";
import GetMuiIcon from "../../../utils/getMuiIcon";
import { formatDate } from "./TransactionDetailsModal/utils/transactionUtils";
import { useCategoriesStore } from "../../../store/categoriesStore";

interface TransactionCardProps {
  transaction: TransactionType;
  onTransactionUpdate: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  transaction,
  onTransactionUpdate,
}) => {
  const [openModal, setOpenModal] = useState(false);
  const { categories, defaultCategories } = useCategoriesStore();

  const categoryDisplayName = useMemo(() => {
    const iconName = transaction.category;
    if (!iconName) {
      return "Categoria";
    }
    console.log("Transaction Category:", iconName);
    const allCategories = [...categories, ...defaultCategories];
    console.log("All Categories:", allCategories);
    const foundCategory = allCategories.find((cat) => cat.icon === iconName);
    return foundCategory ? foundCategory.name : iconName;
  }, [transaction.category, categories, defaultCategories]);

  const formattedAmount = transaction.value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const formattedDate = formatDate(transaction.date);

  const handleDelete = async (id: string) => {
    await DeleteTransaction(id);
    setOpenModal(false);
    onTransactionUpdate();
  };

  const handleUpdate = async (updatedTransaction: CreateTransactionType) => {
    await UpdateTransaction({
      ...updatedTransaction,
      id: transaction.id,
    });
    setOpenModal(false);
    onTransactionUpdate();
  };

  const amountColor =
    transaction.type === "EXPENSE" ? "error.main" : "success.main";

  return (
    <>
      <Card
        sx={{
          mb: 1.5,
          minHeight: 90,
          cursor: "pointer",
          transition: "box-shadow 0.2s",
          "&:hover": {
            boxShadow: 3,
          },
        }}
        onClick={() => setOpenModal(true)}
      >
        <CardContent
          sx={{ display: "flex", alignItems: "center", p: "12px !important" }}
        >
          <Avatar sx={{ bgcolor: amountColor, mr: 1.5 }}>
            <GetMuiIcon
              iconName={transaction.category || "Category"}
              sx={{ color: "white" }}
            />
          </Avatar>

          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ lineHeight: 1.2 }}
            >
              {transaction.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {formattedDate} - {categoryDisplayName}
            </Typography>
            <Box sx={{ mt: 0.5, display: "flex", gap: 0.5 }}>
              {!transaction.isPaid && (
                <Chip
                  label="Não Pago"
                  color="warning"
                  size="small"
                  variant="outlined"
                />
              )}
              {transaction.isRecurring && (
                <Chip
                  label="Recorrente"
                  color="info"
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>

          <Box sx={{ textAlign: "right", ml: 1 }}>
            <Typography variant="body1" fontWeight="bold" color={amountColor}>
              {transaction.type === "EXPENSE"
                ? `- ${formattedAmount}`
                : `+ ${formattedAmount}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      <TransactionDetailsModal
        transaction={transaction}
        open={openModal}
        onClose={() => setOpenModal(false)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default TransactionCard;
