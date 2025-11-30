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
import { CategoryAllocationType, CopyFromMonthRequestType, FinancialPlanningWithCategoriesType } from "../../schemas/FinancialPlanning";
import { CopyPlanningFromMonth } from "../../services/FinancialPlanning/CopyPlanningFromMonth";
import { useFinancialPlanningStore } from "../../store/financialPlanningStore";

export const usePlanningViewModel = () => {
  dayjs.extend(isBetween);
  dayjs.locale("pt-br");
  dayjs.extend(utc);
  dayjs.extend(timezone);

  const { fetchFinancialPlanningByMonth, financialPlan, clearFinancialPlanning, isLoading } = useFinancialPlanningStore();
  const [financialPlanningData, setFinancialPlanningData] = useState<FinancialPlanningWithCategoriesType>({} as FinancialPlanningWithCategoriesType);
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

  const handleOnClickCopyPlanning = () => {
    const payload = {
      sourceMonth: selectedMonth.subtract(1, "month").format("YYYY-MM"),
      targetMonth: selectedMonth.format("YYYY-MM"),
    } as CopyFromMonthRequestType;
    CopyPlanningFromMonth(payload);
  }

  const handleCancelPlanning = () => {
    setIsCreatingPlanning(false);
  };

  useEffect(() => {
    clearFinancialPlanning();
    fetchFinancialPlanningByMonth(selectedMonth.format("YYYY-MM"));
  }, [selectedMonth]);

  useEffect(() => {
    if (financialPlan) {
      const FinancialPlanning = financialPlan;
      setFinancialPlanningData(FinancialPlanning);
      if (!FinancialPlanning) return;
      setAllocationsData(FinancialPlanning.categoryAllocations || []);
    } else {
      setAllocationsData([]);
    }
  }, [financialPlan]);

  const hasRecords = allocationsData.length > 0;

  const tabsConfig: TabConfig[] = [
    {
      label: "Planejamento Mensal",
      content: <BudgetTable
        data={allocationsData}
      />,
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
    handleOnClickCopyPlanning,
    hasRecords,
    tabsConfig,
    handleCancelPlanning
  };
};
