import { create } from "zustand";
import { SimulationType } from "../schemas/Simulation/Simulation";
import { GetSimulationData } from "../services/Simulation/getSimulationData";

interface SimulationState {
    simulationData: SimulationType;
    message: string;
    isLoading: boolean;
    fetchSimulationData: () => Promise<void>;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    simulationData: {} as SimulationType,
    message: "",
    isLoading: false,

    fetchSimulationData: async () => {
        set({ isLoading: true });
        try {
            const response = await GetSimulationData();
            if (!response || !response.data) return;

            // AJUSTE: O schema diz que 'data' é array. Pegamos o primeiro item ou o próprio objeto se não for array.
            const dataToSave = Array.isArray(response.data) ? response.data[0] : response.data;

            set({
                simulationData: dataToSave as unknown as SimulationType, // Forçamos o tipo para bater com o State
                message: response.message,
            });
        } catch (error) {
            console.error("Erro ao pegar dados:", error);
        } finally {
            set({ isLoading: false });
        }
    },
}));
