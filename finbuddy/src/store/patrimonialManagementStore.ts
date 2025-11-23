import { create } from "zustand";
import { AnyPatrimonialItemType } from "../schemas/PatrimonialManagement/PatrimonialItem";
import { GetAllPatrimonialManagement } from "../services/PatrimonialManagement/getAllPatrimonialManagement";

interface PatrimonialManagementState {
    patrimonialItens: AnyPatrimonialItemType[];
    totalPatrimonyValue: number;
    message: string;
    isLoading: boolean;
    fetchPatrimonialItens: () => Promise<void>;
}

export const usePatrimonialManagementStore = create<PatrimonialManagementState>((set) => ({
    patrimonialItens: [],
    totalPatrimonyValue: 0,
    message: '',
    isLoading: false,

    fetchPatrimonialItens: async () => {
        set({ isLoading: true });
        try {
            const response = await GetAllPatrimonialManagement();
            const patrimonialItens = response?.data as unknown as AnyPatrimonialItemType[];
            const totalPatrimonyValue = patrimonialItens.reduce((acc, item) => {
                if (item.category === 'Asset') {
                    return acc + (item.avgCost || 0) * (item.quantity || 0);
                } else if (item.category === 'Liability') {
                    return acc + (item.totalDebtAmount || 0) - (item.updatedDebtsAmount || 0);
                }
                return acc;
            }, 0);



                set({
                    totalPatrimonyValue: totalPatrimonyValue,
                    patrimonialItens: patrimonialItens,
                    message: response?.message
                })
            } catch (error) {
                console.error(error);
            } finally {
                set({ isLoading: false });
            }
        }
}))