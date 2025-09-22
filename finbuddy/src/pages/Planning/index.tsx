import React, { useState, useEffect } from 'react';
import BudgetTable from './components/BudgetTable';
import CategoryTable from './components/CategoryTable';
import { Typography, Container, IconButton, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { BudgetItem } from './components/types';
import { TabConfig, TabsContainer } from './components/TabsContainer';
import { PlanningForm } from './components/PlanningForm';

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
    const [isCreatingPlanning, setIsCreatingPlanning] = useState(false);

    const [selectedTab, setSelectedTab] = useState(0);
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedTab(newValue);
    };

    useEffect(() => {
        setLoading(true);
        // Simulação: busca de dados com base no mês e ano
        setTimeout(() => {
            // Se o mês for setembro (índice 8), retorna os dados de exemplo.
            // Caso contrário, retorna um array vazio.
            const hasDataForSelectedMonth = currentDate.getMonth() === 8;

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

    const tabsConfig: TabConfig[] = [
        {
            label: 'Planejamento Mensal',
            content: <BudgetTable data={budgetData} />
        },
        {
            label: 'Orçamento por Categoria',
            content: <CategoryTable data={budgetData} />
        }
    ];

    return (
        <Container maxWidth="md">
            {!isCreatingPlanning ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px' }}>
                        <IconButton onClick={handlePrevMonth} size="large">
                            <ArrowBackIosIcon />
                        </IconButton>
                        <Typography variant="h5" sx={{ margin: '0 20px', fontWeight: 'bold' }}>
                            {selectedMonth} De {selectedYear}
                        </Typography>
                        <IconButton onClick={handleNextMonth} size="large">
                            <ArrowForwardIosIcon />
                        </IconButton>
                    </div>

                    {loading ? (
                        <Typography variant="body1" align="center">Carregando dados...</Typography>
                    ) : (
                        hasRecords ? (
                            <TabsContainer
                                tabs={tabsConfig}
                                value={selectedTab}
                                onChange={handleTabChange}
                            />
                        ) : (
                            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Parece que você não tem registros para este mês.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="large"
                                    sx={{ mt: 2 }}
                                    // Adicionar a função de navegação para a página de adicionar registro
                                    onClick={() => setIsCreatingPlanning(true)}
                                >
                                    Botão do weder
                                </Button>
                            </div>
                        )
                    )}
                </>
            ) : <PlanningForm />}
        </Container>
    );
};