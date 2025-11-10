// src/components/ExpenseModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  FormControlLabel,
  Switch, // <-- 1. [CORREÇÃO] Importar o Switch
} from "@mui/material";
// (Ajustei o path para ser relativo à pasta 'components')
import { NewExpenseData } from "../ImpactSimulationPage";

// Props do Modal
interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewExpenseData) => void;
}

// Estilo do Modal
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  // Estados internos do formulário
  const [name, setName] = useState("");
  const [value, setValue] = useState<number | "">(""); 
  const [isFixed, setIsFixed] = useState(true); // <-- 2. [CORREÇÃO] Adicionar o estado para o Switch

  // Limpa o formulário quando o modal é fechado
  useEffect(() => {
    if (!open) {
      setName("");
      setValue("");
      setIsFixed(true); // <-- 3. [CORREÇÃO] Resetar o estado do Switch
    }
  }, [open]);

  const handleSubmit = () => {
    const numericValue = typeof value === "number" ? value : 0;

    // Validação simples
    if (!name || numericValue <= 0) {
      alert("Por favor, preencha o nome e um valor válido.");
      return;
    }

    // Envia os dados para a página pai
    onSubmit({
      name,
      value: numericValue,
      isFixed: isFixed, // <-- 4. [CORREÇÃO] Usar o estado 'isFixed' (e não 'false')
    });

    // O onClose() é chamado na página principal, o que dispara o useEffect de limpeza.
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          Cadastrar Despesa
        </Typography>
        <Typography
          id="modal-description"
          sx={{ mt: 1, mb: 2, color: "text.secondary" }}
        >
          Insira os dados da sua despesa.
        </Typography>

        <Stack component="form" spacing={2} noValidate>
          <TextField
            fullWidth
            label="Nome da Despesa"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Valor" // Alterado de "Valor Mensal" para "Valor"
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || "")}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$</InputAdornment>
              ),
            }}
          />

          {/* O Switch agora está corretamente conectado ao estado */}
          <FormControlLabel
            control={
              <Switch
                checked={isFixed}
                onChange={(e) => setIsFixed(e.target.checked)}
                name="isFixed"
              />
            }
            label="Gasto Fixo (Mensal)?"
            sx={{ color: "text.secondary" }}
          />
          <Box
            sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
          >
            <Button onClick={onClose} color="inherit">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">
              Salvar
            </Button>
          </Box>
        </Stack>
      </Box>
    </Modal>
  );
};