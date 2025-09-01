import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { GetBalancesByMonthRequestType, GetBalancesByMonthResponseType } from "../../schemas/BankAccount";

export const GetBalancesByMonth = async (body: GetBalancesByMonthRequestType): Promise<GetBalancesByMonthResponseType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getBalancesByMonthFn = httpsCallable(functions, 'bank-getBalancesByMonth');
        const response = await getBalancesByMonthFn(body.data);
        console.log('Saldo da conta bancária atualizado:', response.data);

        return response.data as GetBalancesByMonthResponseType;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
    return undefined;
}