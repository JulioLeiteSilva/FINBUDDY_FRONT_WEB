import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { GetFinancialPlanningByMonthRequestType, GetFinancialPlanningByMonthResponseType } from "../../schemas/FinancialPlanning";

export const GetFinancialPlanningByMonth = async (body: GetFinancialPlanningByMonthRequestType): Promise<GetFinancialPlanningByMonthResponseType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getFinancialPlanningByMonthFn = httpsCallable(functions, 'financialPlanning-getByMonth');
        const response = await getFinancialPlanningByMonthFn(body);

        return response.data as GetFinancialPlanningByMonthResponseType;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
    }
    return undefined;
}