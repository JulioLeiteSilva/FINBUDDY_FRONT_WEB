import { useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import localizedFormat from 'dayjs/plugin/localizedFormat';

import { useDashboardData } from '../../hooks/useDashboardData';



dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export const useDashboardViewModel = () => {
    const [selectedMonth, setSelectedMonth] = useState(dayjs());
    const {
        isLoading,
        transactionsForCharts,
        dataForMonthlyBarChart,
    } = useDashboardData();

    const handlePreviousMonth = () => {
        setSelectedMonth(prev => prev.subtract(1, 'month'));
    };

    const handleNextMonth = () => {
        setSelectedMonth(prev => prev.add(1, 'month'));
    };

    return {
        isLoading,
        transactionsForCharts,
        dataForMonthlyBarChart,
        handlePreviousMonth,
        handleNextMonth,
        selectedMonth,
    }
}