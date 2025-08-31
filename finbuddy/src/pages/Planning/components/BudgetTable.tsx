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
} from "@mui/material";

import { BudgetItem } from "./types";


interface BudgetTableProps {
    data: BudgetItem[];
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const BudgetTable: React.FC<BudgetTableProps> = ({ data }) => {
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
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: BudgetItem) => {
              // 'row' agora é explicitamente do tipo BudgetItem
              // Lógica de Progresso e Status
              const progressValue =
                row.value > 0 ? (row.spent / row.value) * 100 : 0;
              const isOverBudget = row.spent > row.value;

              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                  <TableCell align="left" component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="left">
                    {formatCurrency(row.value)}
                  </TableCell>
                  <TableCell align="left">
                    {formatCurrency(row.spent)}
                  </TableCell>
                  <TableCell align="left">
                    <Box sx={{ display: "flex", alignItems: "center" }}>
                      <Box sx={{ width: "100%", mr: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={progressValue > 100 ? 100 : progressValue}
                          color={isOverBudget ? "error" : "primary"}
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
