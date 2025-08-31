import React, { useState, useEffect} from 'react';
import BudgetTable from './components/BudgetTable';
import CategoryTable from './components/CategoryTable';
import {Typography, Container} from '@mui/material';
import { BudgetItem } from './components/types';

const mockDataFromFirebase: BudgetItem[] = [
    { id: 'cat1', category: 'Alimentação', value: 1500, spent: 750, paid: 600 },
    { id: 'cat2', category: 'Transporte', value: 300, spent: 320.50, paid: 200.00 },
    { id: 'cat3', category: 'Moradia', value: 2000, spent: 2000, paid: 2000 },
    { id: 'cat4', category: 'Lazer', value: 500, spent: 150.75, paid: 100 },
    { id: 'cat5', category: 'Educação', value: 800, spent: 0, paid: 0 },
    { id: 'cat6', category: 'Saúde', value: 400, spent: 550, paid: 300 },
];

export const PlanningPage: React.FC = () => {
    const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setTimeout(() => {
            setBudgetData(mockDataFromFirebase);
            setLoading(false);
        }, 1000);
    }, []);

    return (
    <>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
          Meu orçamento mensal
        </Typography>
        
        {loading ? (
          <Typography variant="body1">Carregando dados...</Typography>
        ) : (
          <BudgetTable data={budgetData} />
        )}
      </Container>

      <Container>
        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
          Orçamento por Categoria
        </Typography>
        
        {loading ? (
          <Typography variant="body1">Carregando dados...</Typography>
        ) : (
          <CategoryTable data={budgetData} />
        )}
      </Container>
    </>
  );
};