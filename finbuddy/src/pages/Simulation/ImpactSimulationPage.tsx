// src/pages/ImpactSimulationPage.tsx
import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Box,
  // Grid, // <-- REMOVIDO
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import InfoIcon from '@mui/icons-material/Info';

// (Importando os novos componentes de lista)
import { AssetList } from './Components/AssetList';

// (Importando os modais)
import { AssetModal } from './Components/AssetModal';
import { ExpenseModal } from './Components/ModalExpenses';
import { ExpenseList } from './Components/ExpenseList';

// --- Tipos (Idealmente em 'types.ts') ---
interface AssetItem { id: string; name: string; value: number; }
export type NewAssetData = Omit<AssetItem, 'id'>;
interface ExpenseItem { id: string; name: string; value: number; isFixed: boolean; }
export type NewExpenseData = Omit<ExpenseItem, 'id'>;
// --------------------------------------------------------

export const ImpactSimulationPage: React.FC = () => {
  // --- ESTADO (Permanece aqui) ---
  const [assets, setAssets] = useState<AssetItem[]>([
    { id: 'p1', name: 'Conta Corrente', value: 15000 },
    { id: 'p2', name: 'Investimentos', value: 85000 },
  ]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 'g1', name: 'Aluguel', value: 2500, isFixed: true },
    { id: 'g2', name: 'Alimentação', value: 1500, isFixed: true },
  ]);

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState<string | null>(null);

  // --- LÓGICA / HANDLERS (Permanecem aqui) ---
  const handleAddAsset = (data: NewAssetData) => {
    const newId = `a${Date.now()}`;
    setAssets(prev => [...prev, { ...data, id: newId }]);
    setIsAssetModalOpen(false);
  };

  const handleAddExpense = (data: NewExpenseData) => {
    const newId = `e${Date.now()}`;
    setExpenses(prev => [...prev, { ...data, id: newId }]);
    setIsExpenseModalOpen(false); 
  };

  const handleDeleteAsset = (id: string) => {
    setAssets(prev => prev.filter(item => item.id !== id));
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(item => item.id !== id));
  };

  const handleCalculateImpact = () => {
    const totalAssets = assets.reduce((acc, item) => acc + item.value, 0);
    const monthlyExpenses = expenses
      .filter(item => item.isFixed)
      .reduce((acc, item) => acc + item.value, 0);

    // ... (lógica de cálculo para 'finalResult') ...
    if (monthlyExpenses <= 0) { setSimulationResult("Sem gastos fixos."); return; }
    if (totalAssets <= 0) { setSimulationResult("Sem patrimônio."); return; }
    const totalMonths = totalAssets / monthlyExpenses;
    const years = Math.floor(totalMonths / 12);
    const months = Math.floor(totalMonths % 12);
    const yearText = years > 0 ? `${years} ${years > 1 ? 'anos' : 'ano'}` : '';
    const monthText = months > 0 ? `${months} ${months > 1 ? 'meses' : 'mês'}` : '';
    let finalResult = yearText && monthText ? `${yearText} e ${monthText}` : (yearText || monthText || "Menos de um mês");
    setSimulationResult(finalResult);
  };
  
  // --- CÁLCULOS PARA DISPLAY (Permanecem aqui) ---
  const totalAssetsValue = assets.reduce((acc, item) => acc + item.value, 0);
  const monthlyExpensesValue = expenses
    .filter(item => item.isFixed)
    .reduce((acc, item) => acc + item.value, 0);

  // --- RENDERIZAÇÃO ---
  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 1 }}>
        Simulação de Impacto
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Descubra quanto tempo seu patrimônio atual conseguiria cobrir seus gastos mensais.
      </Typography>

      {/* --- MUDANÇA AQUI: Trocando Grid por Box com Flexbox --- */}
      <Box
        sx={{
          display: 'flex',
          // Empilha em telas pequenas ('xs'), fica lado-a-lado em telas médias ('md') para cima
          flexDirection: { xs: 'column', md: 'row' },
          gap: 5, // O espaçamento de 5 que você gostou
        }}
      >
        
        {/* --- Componente de Lista de Ativos --- */}
        <Box sx={{ flex: 1, minWidth: 0 }}> {/* Ocupa 50% do espaço disponível */}
          <AssetList
            assets={assets}
            totalValue={totalAssetsValue}
            onAddClick={() => setIsAssetModalOpen(true)}
            onDeleteClick={handleDeleteAsset}
          />
        </Box>

        {/* --- Componente de Lista de Despesas --- */}
        <Box sx={{ flex: 1, minWidth: 0 }}> {/* Ocupa 50% do espaço disponível */}
          <ExpenseList
            expenses={expenses}
            totalFixedValue={monthlyExpensesValue}
            onAddClick={() => setIsExpenseModalOpen(true)}
            onDeleteClick={handleDeleteExpense}
          />
        </Box>
      </Box>
      
      {/* --- Seção de Cálculo e Resultado --- */}
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleCalculateImpact}
          startIcon={<CalculateIcon />}
        >
          Calcular Simulação
        </Button>
      </Box>

      {simulationResult && (
        <Paper sx={{ p: 4, mt: 2, backgroundColor: 'primary.main', color: 'primary.contrastText' }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <InfoIcon sx={{ fontSize: 40 }} />
            <Box>
              <Typography variant="h6" component="h3">
                Seu patrimônio cobriria seus gastos por:
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                {simulationResult}
              </Typography>
            </Box>
          </Stack>
        </Paper>
      )}

      {/* --- Modais --- */}
      <AssetModal
        open={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        onSubmit={handleAddAsset}
      />
      
      <ExpenseModal
        open={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleAddExpense}
      />

    </Container>
  );
};