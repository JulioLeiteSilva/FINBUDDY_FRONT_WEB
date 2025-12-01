import { create } from "zustand";
import { AnyPatrimonialItemType, AssetItemType, LiabilityItemType, TangibleGoodsItemType } from "../schemas/PatrimonialManagement/PatrimonialItem";
import { GetAllPatrimonialManagement } from "../services/PatrimonialManagement/getAllPatrimonialManagement";
import { patrimonialItemCategory } from "../enums/patrimonialManagement";

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
            console.log('Fetched Patrimonial Items:', patrimonialItens);
            const totalPatrimonyValue = patrimonialItens.reduce((acc, item) => {

                if (item.category === patrimonialItemCategory.LIABILITY) {
                    const liability = item as LiabilityItemType;
                    return acc - (liability.updatedDebtsAmount || 0);
                }

                if ('AssetType' in item) {
                    const asset = item as AssetItemType;
                    return acc + (asset.value || 0);
                }

                if ('type' in item) {
                    const tangible = item as TangibleGoodsItemType;
                    return acc + (tangible.obersationValue || 0);
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