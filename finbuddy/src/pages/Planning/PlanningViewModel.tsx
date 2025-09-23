/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import { BudgetItem } from "./components/PlanningModel";
import BudgetTable from "./components/BudgetTable";
import CategoryTable from "./components/CategoryTable";
import { TabConfig } from "./components/TabsContainer";

const mockDataFromFirebase: BudgetItem[] = [
  { id: "cat1", category: "Alimentação", value: 1500, spent: 750, paid: 600 },
  { id: "cat2", category: "Transporte", value: 300, spent: 320.5, paid: 200.0 },
  { id: "cat3", category: "Moradia", value: 2000, spent: 2000, paid: 2000 },
  { id: "cat4", category: "Lazer", value: 500, spent: 150.75, paid: 100 },
  { id: "cat5", category: "Educação", value: 800, spent: 0, paid: 0 },
  { id: "cat6", category: "Saúde", value: 400, spent: 550, paid: 300 },
];

export const usePlanningViewModel = () => {
  dayjs.extend(isBetween);
  dayjs.locale("pt-br");
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const [budgetData, setBudgetData] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().tz("America/Sao_Paulo")
  );
  const [isCreatingPlanning, setIsCreatingPlanning] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);
  const today = dayjs();

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => prev.subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => prev.add(1, "month"));
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleOnClickCreatePlanning = (value: boolean) => {
    setIsCreatingPlanning(value);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const hasDataForSelectedMonth = selectedMonth.month() === today.month(); //Adicionar função

      if (hasDataForSelectedMonth) {
        setBudgetData(mockDataFromFirebase);
      } else {
        setBudgetData([]);
      }
      setLoading(false);
    }, 1000);
  }, [selectedMonth]);

  const hasRecords = budgetData.length > 0;

  const tabsConfig: TabConfig[] = [
    {
      label: "Planejamento Mensal",
      content: <BudgetTable data={budgetData} />,
    },
    {
      label: "Orçamento por Categoria",
      content: <CategoryTable data={budgetData} />,
    },
  ];

  return {
    budgetData,
    loading,
    selectedMonth,
    isCreatingPlanning,
    selectedTab,
    handlePreviousMonth,
    handleNextMonth,
    handleTabChange,
    handleOnClickCreatePlanning,
    hasRecords,
    tabsConfig,
  };
};
