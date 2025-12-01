// src/pages/ImpactSimulationPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Paper, Box, Stack, CircularProgress } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

// Componentes
import { AssetList } from './Components/AssetList';
import { ExpenseList } from './Components/ExpenseList';
import { AssetModal } from './Components/AssetModal';
import { ExpenseModal } from './Components/ModalExpenses';
import { useImpactCalculator } from './Components/useImpactCalculator';
import { useCategoriesStore } from '../../store/categoriesStore';
import { useSimulationStore } from '../../store/simulation';
import { mapSimulationToUI } from './utils/simulationMapper';


// Tipos
export interface AssetItem { id: string; name: string; value: number; isMonthly?: boolean; iconName?: string; }
export type NewAssetData = Omit<AssetItem, 'id'>;
export interface ExpenseItem { id: string; name: string; value: number; isFixed: boolean; iconName?: string; }
export type NewExpenseData = Omit<ExpenseItem, 'id'>;

export const ImpactSimulationPage: React.FC = () => {
  // --- STORES ---
  const { simulationData, fetchSimulationData, isLoading: isSimLoading } = useSimulationStore();
  
  // Extraindo dados do store de categorias
  const { 
    categories, 
    defaultCategories, 
    fetchCategories, 
    isLoading: isCatLoading 
  } = useCategoriesStore();

  // --- ESTADOS LOCAIS ---
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // --- 1. FETCH INICIAL (Simulação + Categorias) ---
  useEffect(() => {
    fetchSimulationData();
    fetchCategories(); 
  }, [fetchSimulationData, fetchCategories]);

  // --- 2. LISTA UNIFICADA DE CATEGORIAS ---
  // Memoizamos para não recriar o array toda hora
  const allCategories = useMemo(() => {
    return [...defaultCategories, ...categories];
  }, [defaultCategories, categories]);

  // --- 3. SINCRONIZAÇÃO E MAP (Onde a mágica acontece) ---
  useEffect(() => {
    // Só roda se tiver dados da simulação E se as categorias já tiverem carregado (opcional, mas evita piscar ícone errado)
    if (simulationData) {
      const { assets: mappedAssets, expenses: mappedExpenses } = mapSimulationToUI(
        simulationData, 
        allCategories // <--- Passamos a lista completa para o mapper buscar
      );
      
      setAssets(mappedAssets);
      setExpenses(mappedExpenses);
    }
  }, [simulationData, allCategories]); // Recalcula se a simulação ou as categorias mudarem

  // Hook de Cálculo
  const { 
    totalAccumulatedWealth, 
    totalMonthlyIncome, 
    totalMonthlyFixedExpenses, 
    resultText,
    status 
  } = useImpactCalculator(assets, expenses);

  // ... (O restante dos handlers handleAddAsset, handleAddExpense, etc. continua igual) ...

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

  // Loading State (Se qualquer um dos dois estiver carregando)
  if (isSimLoading || (isCatLoading && allCategories.length === 0)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 1 }}>
        Simulação de Impacto
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 5 }}>
        
        {/* LISTA DE ATIVOS */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <AssetList
            assets={assets}
            totalValue={totalAccumulatedWealth}
            onAddClick={() => setIsAssetModalOpen(true)}
            onDeleteClick={handleDeleteAsset}
          />
           {totalMonthlyIncome > 0 && (
             <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 1, color: 'success.main' }}>
                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalMonthlyIncome)} renda mensal
             </Typography>
          )}
        </Box>

        {/* LISTA DE DESPESAS */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <ExpenseList
            expenses={expenses}
            totalFixedValue={totalMonthlyFixedExpenses}
            onAddClick={() => setIsExpenseModalOpen(true)}
            onDeleteClick={handleDeleteExpense}
          />
        </Box>
      </Box>
      
      <Paper 
        sx={{ 
          p: 4, 
          mt: 4, 
          bgcolor: status === 'success' ? 'success.light' : (status === 'error' ? 'error.light' : 'primary.main'), 
          color: status === 'success' || status === 'error' ? 'black' : 'primary.contrastText',
          transition: 'background-color 0.3s'
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <InfoIcon sx={{ fontSize: 40 }} />
          <Box>
            <Typography variant="h6" component="h3">
              {status === 'success' ? 'Parabéns!' : 'Previsão de Cobertura:'}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {resultText}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Modais */}
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