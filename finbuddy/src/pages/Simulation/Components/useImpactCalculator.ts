// src/hooks/useImpactCalculator.ts
import { useMemo } from 'react';

// Tipos definidos localmente ou importados
interface AssetItem { value: number; isMonthly?: boolean; }
interface ExpenseItem { value: number; isFixed: boolean; }

export const useImpactCalculator = (assets: AssetItem[], expenses: ExpenseItem[]) => {
  
  const calculation = useMemo(() => {
    
    // --- 1. O TANQUE (Estoque de Dinheiro) ---
    
    // Ganhos Pontuais (Patrimônio Acumulado)
    // Tudo que NÃO é renda mensal (ex: saldo em conta, carro, casa)
    const totalAccumulatedWealth = assets
      .filter(item => !item.isMonthly)
      .reduce((acc, item) => acc + item.value, 0);

    // Gastos Pontuais (Saída Imediata)
    // Tudo que NÃO é fixo (ex: uma viagem única, compra de equipamento)
    // Isso deve ser descontado do patrimônio imediatamente.
    const totalOneOffExpenses = expenses
      .filter(item => !item.isFixed)
      .reduce((acc, item) => acc + item.value, 0);

    // Patrimônio Efetivo (O que sobra na mão hoje)
    const effectiveWealth = totalAccumulatedWealth - totalOneOffExpenses;


    // --- 2. O CONSUMO (Fluxo Mensal) ---

    // Renda Mensal (Entradas recorrentes)
    const totalMonthlyIncome = assets
      .filter(item => item.isMonthly)
      .reduce((acc, item) => acc + item.value, 0);

    // Despesas Fixas (Saídas recorrentes)
    const totalMonthlyFixedExpenses = expenses
      .filter(item => item.isFixed)
      .reduce((acc, item) => acc + item.value, 0);

    // Queima Mensal Líquida (Quanto falta todo mês?)
    const netMonthlyBurn = totalMonthlyFixedExpenses - totalMonthlyIncome;


    // --- 3. RESULTADO E MENSAGENS ---
    
    let resultText = '';
    let status: 'success' | 'warning' | 'error' | 'neutral' = 'neutral';

    // Caso 0: Nada cadastrado
    if (assets.length === 0 && expenses.length === 0) {
        resultText = "Adicione patrimônios e despesas para ver a simulação.";
        status = 'neutral';
    
    // Caso 1: Patrimônio Efetivo Negativo (Gastos Pontuais > Patrimônio)
    } else if (effectiveWealth < 0) {
        resultText = "Seus gastos pontuais excedem seu patrimônio acumulado. Você já começaria no vermelho.";
        status = 'error';

    // Caso 2: Independência Financeira (Renda Mensal > Despesas Fixas)
    } else if (netMonthlyBurn <= 0) {
      resultText = "Liberdade Financeira! Sua renda mensal cobre todas as despesas fixas.";
      status = 'success';

    // Caso 3: Sem patrimônio líquido para cobrir o buraco mensal
    } else if (effectiveWealth === 0 && netMonthlyBurn > 0) {
      resultText = "Você não possui patrimônio disponível para cobrir suas despesas mensais.";
      status = 'error';

    // Caso 4: Cálculo de Sobrevivência (Cenário Padrão)
    } else {
      const totalMonths = effectiveWealth / netMonthlyBurn;
      const years = Math.floor(totalMonths / 12);
      const months = Math.floor(totalMonths % 12);
      
      const yearText = years > 0 ? `${years} ${years > 1 ? 'anos' : 'ano'}` : '';
      const monthText = months > 0 ? `${months} ${months > 1 ? 'meses' : 'mês'}` : '';
      
      // Se for menos de 1 mês completo
      const timeString = (years === 0 && months === 0) 
        ? "Menos de 1 mês" 
        : (yearText && monthText ? `${yearText} e ${monthText}` : (yearText || monthText));
        
      resultText = timeString;
      status = 'warning';
    }

    return {
      // Valores brutos
      totalAccumulatedWealth,
      totalOneOffExpenses,
      effectiveWealth, // O valor real usado na conta
      
      totalMonthlyIncome,
      totalMonthlyFixedExpenses,
      netMonthlyBurn,
      
      // Resultado UI
      resultText,
      status
    };

  }, [assets, expenses]);

  return calculation;
};