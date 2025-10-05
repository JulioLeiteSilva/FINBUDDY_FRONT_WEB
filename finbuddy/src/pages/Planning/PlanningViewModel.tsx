/* eslint-disable react-hooks/exhaustive-deps */
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import isBetween from "dayjs/plugin/isBetween";
import { useEffect, useState } from "react";
import BudgetTable from "./components/BudgetTable";
import CategoryTable from "./components/CategoryTable";
import { TabConfig } from "./components/TabsContainer";
import { useLoadingStore } from "../../store/loadingStore";
import { CategoryAllocationType, GetFinancialPlanningByMonthResponseType } from "../../schemas/FinancialPlanning";
import { GetFinancialPlanningByMonth } from "../../services/FinancialPlanning";

export const usePlanningViewModel = () => {
  dayjs.extend(isBetween);
  dayjs.locale("pt-br");
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { isLoading, startLoading, stopLoading } = useLoadingStore();
  const [financialPlanningData, setFinancialPlanningData] = useState<GetFinancialPlanningByMonthResponseType>({} as GetFinancialPlanningByMonthResponseType);
  const [allocationsData, setAllocationsData] = useState<CategoryAllocationType[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(
    dayjs().tz("America/Sao_Paulo")
  );
  const [isCreatingPlanning, setIsCreatingPlanning] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0);

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

  const getFinancialPlanningData = async (month: string) => {
    if (!month) return;
    const body = { month };
    const response = await GetFinancialPlanningByMonth(body);
    if (response) {
      const FinancialPlanning = response as GetFinancialPlanningByMonthResponseType;
      setFinancialPlanningData(FinancialPlanning);
      if (!FinancialPlanning.data) return; 
      setAllocationsData(FinancialPlanning.data.categoryAllocations || []);
    } else {
      setAllocationsData([]);
    }
  };

  useEffect(() => {
    startLoading();
    getFinancialPlanningData(selectedMonth.format("YYYY-MM"));
    stopLoading();
  }, [selectedMonth]);

  const hasRecords = allocationsData.length > 0;

  const tabsConfig: TabConfig[] = [
    {
      label: "Planejamento Mensal",
      content: <BudgetTable data={allocationsData} />,
    },
    {
      label: "Orçamento por Categoria",
      content: <CategoryTable data={allocationsData} />,
    },
  ];

  return {
    financialPlanningData,
    allocationsData,
    isLoading,
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
