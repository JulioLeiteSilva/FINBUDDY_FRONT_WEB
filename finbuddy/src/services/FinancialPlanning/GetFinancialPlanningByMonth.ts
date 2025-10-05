import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { GetFinancialPlanningByMonthRequestType, GetFinancialPlanningByMonthResponseType } from "../../schemas/FinancialPlanning";
import { FirebaseError } from "firebase/app";

export const GetFinancialPlanningByMonth = async (body: GetFinancialPlanningByMonthRequestType): Promise<GetFinancialPlanningByMonthResponseType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getFinancialPlanningByMonthFn = httpsCallable(functions, 'financialPlanning-getByMonth');
        const response = await getFinancialPlanningByMonthFn(body);

        return response.data as GetFinancialPlanningByMonthResponseType;
    } catch (error) {
        const firebaseError = error as FirebaseError;
        const backendMessage = firebaseError.message;
        const fallbackMessage = getFirebaseAuthErrorMessage(firebaseError.code || 'unknown');
        const messageToShow = backendMessage || fallbackMessage;

        showSnackbar(messageToShow, 'error');
    }
    return undefined;
}