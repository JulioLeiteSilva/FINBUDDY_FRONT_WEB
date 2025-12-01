// src/components/AssetModal.tsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  ButtonGroup,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  InputAdornment,
  Tooltip,
  IconButton,
  SelectChangeEvent,
  FormControlLabel,
  Switch,
} from "@mui/material";
import HelpOutline from "@mui/icons-material/HelpOutline";
import { NewAssetData } from "../ImpactSimulationPage"; // Importando o tipo
import { set } from "react-hook-form";

interface AssetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: NewAssetData) => void;
}

// Estilo (pode ser compartilhado)
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 600, md: 700 },
  maxHeight: "90%",
  overflowY: "auto",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Tipos para os formulários internos
type AssetType = "financial" | "physical" | "other"; // "Ações", "Bens", "Passivo"
type FinancialAssetType = "fixed" | "stock" | "fii" | "crypto" | "";
type PhysicalAssetType = "property" | "vehicle" | "other" | "";

export const AssetModal = ({ open, onClose, onSubmit }: AssetModalProps) => {
  // --- Estados de Controle de UI ---
  const [selectedType, setSelectedType] = useState<AssetType | null>(null);
  const [selectedFinancialType, setSelectedFinancialType] =
    useState<FinancialAssetType>("");
  const [selectedPhysicalType, setSelectedPhysicalType] =
    useState<PhysicalAssetType>("");

  // --- Estados do Formulário (Financial) ---
  const [finName, setFinName] = useState("");
  const [finQuantity, setFinQuantity] = useState<number | "">("");
  const [finAvgCost, setFinAvgCost] = useState<number | "">("");
  const [finTag, setFinTag] = useState("");

  // --- Estados do Formulário (Physical) ---
  const [phyDescription, setPhyDescription] = useState("");
  const [phyInitialValue, setPhyInitialValue] = useState<number | "">("");

  const [otherDescription, setOtherDescription] = useState("");
  const [otherValue, setOtherValue] = useState<number | "">("");
  const [otherIsMonthly, setOtherIsMonthly] = useState(false);
  // (Formulário de passivo omitido por enquanto,
  //  pois a página principal só aceita Ativos)

  // --- Funções Auxiliares ---
  const clearFormStates = () => {
    setSelectedType(null);
    setSelectedFinancialType("");
    setSelectedPhysicalType("");

    setFinName("");
    setFinQuantity("");
    setFinAvgCost("");
    setFinTag("");

    setPhyDescription("");
    setPhyInitialValue("");

    setOtherDescription("");
    setOtherValue("");
    setOtherIsMonthly(false);
  };

  // Limpa o formulário sempre que o modal for fechado
  useEffect(() => {
    if (!open) {
      setTimeout(clearFormStates, 300); // Pequeno delay para a animação de fechar
    }
  }, [open]);

  // --- Handler de Submissão ---
  const handleSubmit = () => {
    let dataToSubmit: (NewAssetData & {isMonthly?: boolean}) | null = null;

    // 1. Se for Ativo Financeiro ("Ações")
    if (selectedType === "financial" && selectedFinancialType) {
      const quantity = Number(finQuantity) || 0;
      const avgCost = Number(finAvgCost) || 0;

      if (finName && quantity > 0 && avgCost > 0) {
        dataToSubmit = {
          name: finName,
          value: quantity * avgCost, // O valor total é a "mágica"
          isMonthly: false,
        };
      }
    }

    // 2. Se for Ativo Físico ("Bens Materiais")
    if (selectedType === "physical" && selectedPhysicalType) {
      const initialValue = Number(phyInitialValue) || 0;

      if (phyDescription && initialValue > 0) {
        dataToSubmit = {
          name: phyDescription,
          value: initialValue,
          isMonthly: false,
        };
      }
    }

    // 3. Se for Passivo (Ignoramos o envio para a lista de ATIVOS)
    if (selectedType === "other") {
      const val = Number(otherValue) || 0;
      if (otherDescription && val > 0) {
        dataToSubmit = {
          name: otherDescription,
          value: val,
          isMonthly: otherIsMonthly
        };
      }
    }

    // 4. Enviar os dados e fechar
    if (dataToSubmit) {
      onSubmit(dataToSubmit);
    } else {
      // (Adicione uma validação melhor aqui)
      alert("Por favor, preencha todos os campos obrigatórios.");
    }
  };

  // --- Handlers de Mudança ---
  const handleTypeChange = (type: AssetType | null) => {
    setSelectedType(type);
    // Reseta os sub-tipos ao trocar
    setSelectedFinancialType("");
    setSelectedPhysicalType("");
  };

  const handleFinancialTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedFinancialType(event.target.value as FinancialAssetType);
  };

  const handlePhysicalTypeChange = (event: SelectChangeEvent<string>) => {
    setSelectedPhysicalType(event.target.value as PhysicalAssetType);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography id="modal-title" variant="h6" component="h2">
          Cadastro de Patrimônio
        </Typography>
        <Typography
          id="modal-description"
          sx={{ mt: 1, mb: 2, color: "text.secondary" }}
        >
          Escolha o tipo e preencha os valores para o cadastro.
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Tipo de Patrimônio
          </Typography>
          <ButtonGroup variant="outlined" sx={{ width: "100%" }}>
            <Button
              onClick={() => handleTypeChange("financial")}
              variant={selectedType === "financial" ? "contained" : "outlined"}
            >
              Ativo Financeiro
            </Button>
            <Button
              onClick={() => handleTypeChange("physical")}
              variant={selectedType === "physical" ? "contained" : "outlined"}
            >
              Ativo Físico
            </Button>
            <Button
              onClick={() => handleTypeChange("other")}
              variant={selectedType === "other" ? "contained" : "outlined"}
            >
              Outros
            </Button>
          </ButtonGroup>
        </Box>

        {/* --- Formulário de ATIVO FINANCEIRO ("Ações") --- */}
        {selectedType === "financial" && (
          <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="financial-type-label">
                Tipo de Ativo Financeiro
              </InputLabel>
              <Select
                labelId="financial-type-label"
                value={selectedFinancialType}
                label="Tipo de Ativo Financeiro"
                onChange={handleFinancialTypeChange}
              >
                <MenuItem value="fixed">Renda Fixa</MenuItem>
                <MenuItem value="stock">Ações</MenuItem>
                <MenuItem value="fii">FII</MenuItem>
                <MenuItem value="crypto">Cripto</MenuItem>
              </Select>
            </FormControl>

            {/* Campos aparecem se um tipo for selecionado */}
            {selectedFinancialType && (
              <>
                <TextField
                  fullWidth
                  label="Nome / Ticker"
                  name="name"
                  value={finName}
                  onChange={(e) => setFinName(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Coloque o nome da ação igual ao nome do mercado">
                          <IconButton edge="end">
                            <HelpOutline fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Quantidade"
                  type="number"
                  name="quantity"
                  value={finQuantity}
                  onChange={(e) =>
                    setFinQuantity(parseFloat(e.target.value) || "")
                  }
                  required
                />
                <TextField
                  fullWidth
                  label="Custo Médio"
                  type="number"
                  name="avgCost"
                  value={finAvgCost}
                  onChange={(e) =>
                    setFinAvgCost(parseFloat(e.target.value) || "")
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Tag (Opcional)"
                  name="tag"
                  value={finTag}
                  onChange={(e) => setFinTag(e.target.value)}
                />
              </>
            )}
          </Stack>
        )}

        {/* --- Formulário de ATIVO FÍSICO ("Bens Materiais") --- */}
        {selectedType === "physical" && (
          <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="physical-type-label">Tipo de Bem</InputLabel>
              <Select
                labelId="physical-type-label"
                value={selectedPhysicalType}
                label="Tipo de Bem"
                onChange={handlePhysicalTypeChange}
              >
                <MenuItem value="property">Imóvel</MenuItem>
                <MenuItem value="vehicle">Veículo</MenuItem>
                <MenuItem value="other">Outro</MenuItem>
              </Select>
            </FormControl>

            {selectedPhysicalType && (
              <>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={phyDescription}
                  onChange={(e) => setPhyDescription(e.target.value)}
                  required
                />
                <TextField
                  fullWidth
                  label="Valor Inicial / Atual"
                  type="number"
                  name="initialValue"
                  value={phyInitialValue}
                  onChange={(e) =>
                    setPhyInitialValue(parseFloat(e.target.value) || "")
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">R$</InputAdornment>
                    ),
                  }}
                />
              </>
            )}
          </Stack>
        )}

        {/* --- Formulário de PASSIVO (Omitido) --- */}
        {selectedType === "other" && (
          <Stack spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Use esta opção para adicionar qualquer outro valor que componha
              seu patrimônio ou gere renda (ex: Aluguéis, Royalties, Saldos
              diversos).
            </Typography>
            <TextField
              fullWidth
              label="Título / Descrição"
              placeholder="Ex: Aluguel Imóvel Rua X"
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Valor Total / Mensal"
              type="number"
              value={otherValue}
              onChange={(e) => setOtherValue(parseFloat(e.target.value) || "")}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">R$</InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={otherIsMonthly}
                  onChange={(e) => setOtherIsMonthly(e.target.checked)}
                  name="otherIsMonthly"
                  />
              }
              label={otherIsMonthly ? "Entrada Mensal (Recorrente)" : "Valor Pontual (Patrimônio)"}
              sx={{ color: 'text.secondary'}}
            />


          </Stack>
        )}

        {/* --- Botões de Ação --- */}
        <Box
          sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 1 }}
        >
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            // Desabilita o botão se não for Passivo e se os campos não estiverem prontos
            disabled={
              selectedType !== "other" &&
              !selectedFinancialType &&
              !selectedPhysicalType
            }
          >
            Salvar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
