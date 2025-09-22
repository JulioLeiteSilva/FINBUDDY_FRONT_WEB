// src/components/PlanningForm.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Typography,
  Slider,
  Stack,
  Autocomplete,
  Chip,
  InputAdornment,
  Button,
  Paper,
  Divider,
  LinearProgress
} from '@mui/material';

// --- Tipos e Dados MOCADOS (Substitua pelos seus dados reais) ---

// Tipo para uma opção de categoria
interface CategoryOption {
  id: string;
  label: string;
}

// Mock de categorias que viriam da sua aplicação
const mockCategoryOptions: CategoryOption[] = [
  { id: 'cat1', label: 'Moradia' },
  { id: 'cat2', label: 'Alimentação' },
  { id: 'cat3', label: 'Transporte' },
  { id: 'cat4', label: 'Lazer' },
  { id: 'cat5', label: 'Saúde' },
  { id: 'cat6', label: 'Educação' },
];

export const PlanningForm: React.FC = () => {
  // --- Estados do Formulário ---
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [spendingGoal, setSpendingGoal] = useState<number>(0);
  const [spendingPercentage, setSpendingPercentage] = useState<number>(0);
  
  const [selectedCategories, setSelectedCategories] = useState<CategoryOption[]>([]);
  const [categoryBudgets, setCategoryBudgets] = useState<Record<string, number>>({});

  // --- Lógica de Sincronização (Slider e Input) ---
  useEffect(() => {
    // Sincroniza a porcentagem quando o valor do objetivo de gasto muda
    if (monthlyIncome > 0) {
      const newPercentage = Math.round((spendingGoal / monthlyIncome) * 100);
      setSpendingPercentage(newPercentage);
    } else {
      setSpendingPercentage(0);
    }
  }, [spendingGoal, monthlyIncome]);

  const handlePercentageChange = (event: Event, newValue: number | number[]) => {
    const newPercentage = newValue as number;
    setSpendingPercentage(newPercentage);
    const newSpendingGoal = (newPercentage / 100) * monthlyIncome;
    setSpendingGoal(parseFloat(newSpendingGoal.toFixed(2)));
  };

  const handleGoalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newGoal = parseFloat(event.target.value) || 0;
    setSpendingGoal(newGoal);
  };
  
  // --- Lógica de Orçamento por Categoria ---
  const handleBudgetChange = (categoryId: string, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setCategoryBudgets(prev => ({
      ...prev,
      [categoryId]: numericValue,
    }));
  };

  const totalAllocated = Object.values(categoryBudgets).reduce((sum, current) => sum + current, 0);
  const remainingToAllocate = spendingGoal - totalAllocated;

  // --- Submissão do Formulário ---
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = {
      monthlyIncome,
      spendingGoal,
      selectedCategories: selectedCategories.map(c => c.id),
      categoryBudgets,
    };
    console.log("Formulário Enviado:", formData);
    // Aqui você enviaria os dados para o Firebase
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* --- Seção 1: Receita e Meta de Gastos --- */}
          <Typography variant="h6">Planejamento Geral</Typography>
          <TextField
            fullWidth
            label="Receita Mensal Total (Planejamento Inicial)"
            type="number"
            value={monthlyIncome || ''}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value) || 0)}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
          />
          
          <Box>
            <Typography gutterBottom>Meta Total de Gastos (Planejamento Total)</Typography>
            <Slider
              value={spendingPercentage}
              onChange={handlePercentageChange}
              aria-labelledby="spending-goal-slider"
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}%`}
              marks={[{value: 50, label: '50%'}, {value: 80, label: '80%'}]}
            />
            <TextField
              fullWidth
              type="number"
              value={spendingGoal || ''}
              onChange={handleGoalChange}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Box>
          
          <Divider />

          {/* --- Seção 2: Categorias --- */}
          <Typography variant="h6">Seleção de Categorias</Typography>
          <Autocomplete
            multiple
            options={mockCategoryOptions}
            getOptionLabel={(option) => option.label}
            value={selectedCategories}
            onChange={(event, newValue) => setSelectedCategories(newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip variant="outlined" label={option.label} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                variant="outlined"
                label="Categorias"
                placeholder="Selecione as categorias"
              />
            )}
          />
          
          <Divider />
          
          {/* --- Seção 3: Metas por Categoria --- */}
          {selectedCategories.length > 0 && (
            <>
              <Typography variant="h6">Orçamento por Categoria</Typography>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2">
                    Total Alocado: R$ {totalAllocated.toFixed(2)} de R$ {spendingGoal.toFixed(2)}
                  </Typography>
                  <LinearProgress variant="determinate" value={(totalAllocated / spendingGoal) * 100} />
                  <Typography variant="body2" color={remainingToAllocate < 0 ? 'error' : 'text.secondary'}>
                    {remainingToAllocate >= 0 
                      ? `Falta alocar: R$ ${remainingToAllocate.toFixed(2)}`
                      : `Excedeu: R$ ${Math.abs(remainingToAllocate).toFixed(2)}`}
                  </Typography>
                </Box>

                {selectedCategories.map((category) => (
                  <TextField
                    key={category.id}
                    label={`Orçamento para ${category.label}`}
                    type="number"
                    value={categoryBudgets[category.id] || ''}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                ))}
              </Stack>
            </>
          )}

          <Button type="submit" variant="contained" size="large">
            Salvar Planejamento
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};