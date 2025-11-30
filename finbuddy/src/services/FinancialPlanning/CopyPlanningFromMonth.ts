/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { httpsCallable } from "firebase/functions";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { functions } from "../firebase";
import { CopyFromMonthRequestType, CopyFromMonthResponseType } from "../../schemas/FinancialPlanning";
import { useFinancialPlanningStore } from "../../store/financialPlanningStore";

export const CopyPlanningFromMonth = async (body: CopyFromMonthRequestType) => {
    const { showSnackbar } = useSnackbarStore.getState();
      const { fetchFinancialPlanningByMonth} = useFinancialPlanningStore.getState();

    try {
        const copyPlanningFromMonth = httpsCallable(functions, 'financialPlanning-copyFromMonth');
        const response = await copyPlanningFromMonth(body);
        fetchFinancialPlanningByMonth(body.targetMonth);

        return response.data as CopyFromMonthResponseType;
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar planejamento financeiro:', error);
    }
}