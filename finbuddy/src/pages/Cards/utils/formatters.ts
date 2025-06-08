// Esta função pode ser usada em toda a aplicação para formatar números para a moeda BRL.
export const formatCurrency = (value: number): string => {
  // Verifica se o valor é um número válido antes de formatar
  if (typeof value !== 'number' || isNaN(value)) {
    // Retorna um valor padrão ou de fallback para entradas não numéricas
    return 'R$ 0,00';
  }
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Futuramente, você pode adicionar outras funções de formatação aqui,
// como formatar datas, etc.