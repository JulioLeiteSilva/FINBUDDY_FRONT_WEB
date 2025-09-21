import React, { useState, useEffect} from 'react';
import BudgetTable from './components/BudgetTable';
import CategoryTable from './components/CategoryTable';
import { Typography, Container, IconButton, Button} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
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
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        setLoading(true);
        // Simular a busca de dados do Firebase com base no mês e ano
        setTimeout(() => {
            // Lógica para verificar se há dados para o mês selecionado
            const hasDataForSelectedMonth = currentDate.getMonth() === 8; // Simulação: apenas setembro (índice 8) tem dados
            
            if (hasDataForSelectedMonth) {
                setBudgetData(mockDataFromFirebase);
            } else {
                setBudgetData([]);
            }
            setLoading(false);
        }, 1000);
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1);
            return newDate;
        });
    };

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const selectedMonth = monthNames[currentDate.getMonth()];
    const selectedYear = currentDate.getFullYear();
    const hasRecords = budgetData.length > 0;

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                <IconButton onClick={handlePrevMonth} size="large">
                    <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h5" sx={{ margin: '0 20px' }}>
                    {selectedMonth} De {selectedYear}
                </Typography>
                <IconButton onClick={handleNextMonth} size="large">
                    <ArrowForwardIosIcon />
                </IconButton>
            </div>
            
            {loading ? (
                <Typography variant="body1">Carregando dados...</Typography>
            ) : (
                hasRecords ? (
                    <>
                        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
                            Meu orçamento mensal
                        </Typography>
                        <BudgetTable data={budgetData} />

                        <Typography variant="h4" gutterBottom sx={{ mt: 3, mb: 3 }}>
                            Orçamento por Categoria
                        </Typography>
                        <CategoryTable data={budgetData} />
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                            Parece que você não tem registros para este mês.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={() => console.log('Botão clicado')} 
                        >
                            Botão do weder
                        </Button>
                    </div>
                )
            )}
        </Container>
    );
};