/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { CreateFinancialPlanningRequestType, CreateFinancialPlanningResponseType } from "../../schemas/FinancialPlanning";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";

export const CreateFinancialPlanning = async (body: CreateFinancialPlanningRequestType) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const createFinancialPlanningFn = httpsCallable(functions, 'financialPlanning-create');
        const response = await createFinancialPlanningFn(body);
        console.log('Planejamento financeiro criado:', response.data);

        showSnackbar('Planejamento financeiro criado com sucesso!', 'success');
        return response.data as CreateFinancialPlanningResponseType;
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar planejamento financeiro:', error);
    }
};