export const formatToBrazilianReals = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};


export const formatCurrency = (value: number | string | undefined | null): string => {
    if (value === undefined || value === null || value === '') return '';

    const num = typeof value === 'string' ? parseFloat(value.replace('R$', '').replace(/\./g, '').replace(',', '.')) : value;
    
    if (isNaN(num)) return '';
    
    return num.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export const unformatCurrency = (value: string | undefined): number | undefined => {
    if (!value) return undefined;
    const cleanedValue = value
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.');
        
    const num = parseFloat(cleanedValue);
    
    return isNaN(num) ? undefined : num;
};