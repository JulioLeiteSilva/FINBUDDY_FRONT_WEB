import React from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  Chip,
  Box,
  Typography,
  IconButton,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { CategoryAllocationType } from "../../../schemas/FinancialPlanning";



interface BudgetTableProps {
    data: CategoryAllocationType[];
    onEdit: (row: CategoryAllocationType) => void;
    onDelete: (row: CategoryAllocationType) => void;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const BudgetTable: React.FC<BudgetTableProps> = ({ data, onEdit, onDelete }) => {
  if (!data || data.length === 0) {
    return (
      <Typography variant="body1">
        Nenhum dado de orçamento disponível.
      </Typography>
    );
  }

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky budget table" sx={{ tableLayout: "fixed"}}>
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>Categoria</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Orçado
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Gasto
              </TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>Progresso</TableCell>
              <TableCell align="left" sx={{ fontWeight: "bold" }}>
                Status
              </TableCell>
              <TableCell align="center" sx={{ fontWeight: "bold", width: '100px' }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: CategoryAllocationType) => {
              const progressValue =
                row.value > 0 ? ((row.spent || 0) / row.value) * 100 : 0;
              const isOverBudget = (row.spent || 0) > row.value;

              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.category.id}>
                  <TableCell align="left" component="th" scope="row">
                    {row.category.name}
                  </TableCell>
                  <TableCell align="left">
                    {formatCurrency(row.value)}
                  </TableCell>
                  <TableCell align="left" sx={{ color: isOverBudget ? 'error.main' : 'inherit' }}>
                    {formatCurrency(row.spent || 0)}
                  </TableCell>
                  <TableCell align="left">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue > 100 ? 100 : progressValue}
                          color={isOverBudget ? "error" : "success"}
                        />
                      </Box>
                      <Box sx={{ minWidth: 35 }}>
                        <Typography variant="body2" color="text.secondary">
                          {`${Math.round(progressValue)}%`}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="left">
                    <Chip
                      label={
                        isOverBudget ? "Acima do Limite" : "Dentro do Limite"
                      }
                      color={isOverBudget ? "error" : "success"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center">
                      <IconButton 
                          color="primary" 
                          size="small" 
                          onClick={() => onEdit(row)} 
                          aria-label="editar"
                      >
                          <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                          color="error" 
                          size="small" 
                          onClick={() => onDelete(row)} 
                          aria-label="deletar"
                      >
                          <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default BudgetTable;
