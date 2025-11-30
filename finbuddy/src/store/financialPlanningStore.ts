import { create } from "zustand";
import { FinancialPlanningWithCategoriesType } from "../schemas/FinancialPlanning";
import { GetFinancialPlanningByMonth } from "../services/FinancialPlanning";

interface FinacialPlanning {
    financialPlan: FinancialPlanningWithCategoriesType;
    isLoading: boolean;
    message: string;
    fetchFinancialPlanningByMonth: (month: string) => Promise<void>;
    clearFinancialPlanning: () => void;
}

export const useFinancialPlanningStore = create<FinacialPlanning>((set) => ({
    financialPlan: {} as FinancialPlanningWithCategoriesType,
    isLoading: false,
    message: '',

    fetchFinancialPlanningByMonth: async (month: string) => {
        set({ isLoading: true });
        try {
            const response = await GetFinancialPlanningByMonth({ month });
            if (response) {
                set({
                    financialPlan: response.data as FinancialPlanningWithCategoriesType,
                    message: response.message
                });
            }
        } catch (error) {
            console.error(error);
        } finally {
            set({ isLoading: false });
        }
    },

    clearFinancialPlanning: () => set({ financialPlan: {} as FinancialPlanningWithCategoriesType})
}));