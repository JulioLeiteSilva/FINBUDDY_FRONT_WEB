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
      if (!response) return;

      set({
        simulationData: response.data as unknown as SimulationType,
        message: response.message,
      });
    } catch (error) {
      console.error("Erro ao pegar todas as transações:", error);
    } finally {
      set({ isLoading: false });
    }
  },
}));
