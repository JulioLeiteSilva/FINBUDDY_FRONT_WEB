// src/utils/simulationMapper.ts

import { CategoryType } from "../../../schemas/Categories";
import { SimulationType } from "../../../schemas/Simulation/Simulation";
import { AssetItem, ExpenseItem } from "../ImpactSimulationPage";


// Função auxiliar para encontrar a categoria na lista unificada
const findCategoryDetails = (
  categoryKey: string, 
  allCategories: CategoryType[]
) => {
  // Tenta achar pelo ID ou pelo Name (dependendo de como seu backend salva)
  console.log(allCategories)
  const found = allCategories.find(c => c.id === categoryKey || c.icon === categoryKey);

  if (found) {
    return {
      displayName: found.name, // O nome bonito (ex: "Alimentação")
      iconName: found.icon     // O nome do ícone pro MUI (ex: "RestaurantIcon")
    };
  }

  // Fallback se não achar a categoria
  return {
    displayName: categoryKey, // Retorna a própria chave
    iconName: 'CategoryIcon'  // Ícone genérico
  };
};

export const mapSimulationToUI = (
  data: SimulationType | undefined, 
  allCategories: CategoryType[] // <--- Recebe as categorias aqui
) => {
  if (!data || !data.inputs || !data.outputs) {
    return { assets: [], expenses: [] };
  }

  // --- 1. Mapeando ATIVOS ---
  const mappedAssets: AssetItem[] = [
    // ... Itens manuais (sem alteração) ...
    ...data.inputs.assets.map(a => ({
      id: `asset-${Math.random()}`, 
      name: a.name,
      value: a.value,
      isMonthly: false,
      iconName: 'AccountBalanceIcon' 
    })),
    // ... Renda Fixa (sem alteração) ...
    ...data.inputs.fixedIncomes.map(i => ({
      id: `inc-${Math.random()}`,
      name: i.name,
      value: i.value,
      isMonthly: true,
      iconName: 'AttachMoneyIcon'
    })),
    // ... MÉDIAS POR CATEGORIA (AQUI ESTÁ A MUDANÇA) ...
    ...data.inputs.averageIncomesByCategory.map(c => {
      const details = findCategoryDetails(c.category, allCategories);
      return {
        id: `avg-inc-${Math.random()}`,
        name: `Média: ${details.displayName}`, // Usa o nome real da categoria
        value: c.averageValue,
        isMonthly: true,
        iconName: details.iconName // Usa o ícone da categoria
      };
    })
  ];

  // --- 2. Mapeando DESPESAS ---
  const mappedExpenses: ExpenseItem[] = [
    // ... Fixas manuais ...
    ...data.outputs.fixedExpenses.map(e => ({
      id: `exp-${Math.random()}`,
      name: e.name,
      value: e.value,
      isFixed: true,
      iconName: 'MoneyOffIcon'
    })),
    // ... MÉDIAS POR CATEGORIA (AQUI ESTÁ A MUDANÇA) ...
    ...data.outputs.averageExpensesByCategory.map(c => {
      const details = findCategoryDetails(c.category, allCategories);
      return {
        id: `avg-exp-${Math.random()}`,
        name: `Média: ${details.displayName}`, // Usa o nome real da categoria
        value: c.averageValue,
        isFixed: true,
        iconName: details.iconName // Usa o ícone da categoria
      };
    }),
    // ... Dívidas ...
    ...data.outputs.debts.map(d => ({
      id: `debt-${Math.random()}`,
      name: d.name,
      value: d.value,
      isFixed: false,
      iconName: 'CreditCardIcon'
    }))
  ];

  return { assets: mappedAssets, expenses: mappedExpenses };
};