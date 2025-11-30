/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import {
  Box, TextField, Typography, Slider, Stack, Autocomplete, Chip, InputAdornment, Button, Paper, Divider, LinearProgress
} from '@mui/material';
import { useCategoriesStore } from '../../../store/categoriesStore';
import { CategoryType } from '../../../schemas/Categories';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreatFinancialPlanningSchema, CreatFinancialPlanningType } from '../../../schemas/FinancialPlanning';
import { CreateFinancialPlanning } from '../../../services/FinancialPlanning';

interface PlanningFormProps {
  onClose: () => void;
  month: string;
}

export const PlanningForm: React.FC<PlanningFormProps> = ({ onClose, month }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    watch,
    setValue
  } = useForm<CreatFinancialPlanningType>({
    resolver: zodResolver(CreatFinancialPlanningSchema),
    defaultValues: {
      monthlyIncome: 0,
      budgetAmount: 0,
      month: month,
      categoryAllocations: [],
    },
  });
  console.log(errors);

  const { categories, defaultCategories, fetchCategories } = useCategoriesStore();

  const monthlyIncome = watch('monthlyIncome');
  const spendingGoal = watch('budgetAmount');

  const categoryAllocations = watch('categoryAllocations');

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit = (data: CreatFinancialPlanningType) => {
    console.log("Dados do formulário:", data);

    const apiPayload = {
      ...data,
      categoryAllocations: data.categoryAllocations.map(alloc => ({
        categoryId: alloc.category.id,
        value: alloc.value,
      })),
    };
    CreateFinancialPlanning(apiPayload);
    reset();
    onClose();
  };

  const handlePercentageChange = (newValue: number) => {
    const newSpendingGoal = (newValue / 100) * monthlyIncome;
    setValue('budgetAmount', parseFloat(newSpendingGoal.toFixed(2)), { shouldValidate: true });
  };

  const totalAllocated = categoryAllocations.reduce((sum, alloc) => {
    // Se alloc.value for NaN (ou null/undefined), vai aparecer 0. Caso contrário, vai aparecer o valor digitado
    const value = Number.isNaN(alloc.value) ? 0 : alloc.value;
    return sum + value;
  }, 0);
  const remainingToAllocate = spendingGoal - totalAllocated;


  

  return (
    <Paper sx={{ p: 4 }}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={4}>
          <Typography variant="h6">Planejamento Geral</Typography>
          <TextField
            fullWidth
            label="Receita Mensal Total"
            type="number"
            {...register('monthlyIncome', { valueAsNumber: true })}
            error={!!errors.monthlyIncome}
            helperText={errors.monthlyIncome?.message}
            InputProps={{
              startAdornment: <InputAdornment position="start">R$</InputAdornment>,
            }}
          />

          <Box>
            <Typography gutterBottom>Meta Total de Gastos (R$ {spendingGoal.toFixed(2)})</Typography>
            <Controller
              name="budgetAmount"
              control={control}
              render={({ field }) => (
                <Slider
                  value={monthlyIncome > 0 ? (field.value / monthlyIncome) * 100 : 0}
                  onChange={(_, newValue) => handlePercentageChange(newValue as number)}
                  aria-labelledby="spending-goal-slider"
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}%`}
                  marks={[{ value: 50, label: '50%' }, { value: 80, label: '80%' }]}
                />
              )}
            />
            <TextField
              fullWidth
              label="Valor da Meta de Gastos"
              type="number"
              {...register('budgetAmount', { valueAsNumber: true })}
              error={!!errors.budgetAmount}
              helperText={errors.budgetAmount?.message}
              InputProps={{
                startAdornment: <InputAdornment position="start">R$</InputAdornment>,
              }}
            />
          </Box>

          <Divider />
          <Typography variant="h6">Seleção de Categorias</Typography>

          <Controller
            name="categoryAllocations"
            control={control}
            render={({ field }) => (
              <Autocomplete
                multiple
                options={[...categories.filter(cat => cat.type === 'EXPENSE'), ...defaultCategories.filter(cat => cat.type === 'EXPENSE')] as CategoryType[]}
                getOptionLabel={(option) => option.name}
                value={field.value.map(alloc => alloc.category)}
                onChange={(event, newValue) => {
                  const newAllocations = newValue.map(category => {
                    const existing = field.value.find(a => a.category.id === category.id);
                    return existing || { category, value: 0 };
                  });
                  field.onChange(newAllocations);
                }}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip variant="outlined" label={option.name} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Categorias"
                    placeholder="Selecione as categorias"
                    error={!!errors.categoryAllocations}
                    helperText={errors.categoryAllocations?.message}
                  />
                )}
              />
            )}
          />

          <Divider />

          {categoryAllocations.length > 0 && (
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

                {categoryAllocations.map((allocation, index) => (
                  <TextField
                    key={allocation.category.id}
                    label={`Orçamento para ${allocation.category.name}`}
                    type="number"
                    {...register(`categoryAllocations.${index}.value`, { valueAsNumber: true })}
                    error={!!errors.categoryAllocations?.[index]?.value}
                    helperText={errors.categoryAllocations?.[index]?.value?.message}
                    InputProps={{
                      startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                    }}
                  />
                ))}
              </Stack>
            </>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">

            <Button 
              type="submit" 
              variant="contained" 
              size="large" 
              onClick={handleSubmit(onSubmit)}
            >
              Salvar Planejamento
            </Button>
            
            <Button 
              variant="outlined" 
              size="large" 
              onClick={onClose} // Navega para /planning
            >
              Cancelar
            </Button>
          
          </Stack>
          {/* >> FIM Botões de Ação << */}
          
        </Stack>
      </Box>
    </Paper>
  );
};