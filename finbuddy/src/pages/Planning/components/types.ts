// Representa um único item na nossa tabela de orçamento
export interface BudgetItem {
  id: string;       // O ID do documento do Firebase
  category: string;
  value: number;    // Mapeado de "Orçado"
  spent: number;    // Mapeado de "Gasto"
  paid: number;    // Mapeado de "Pago"
}