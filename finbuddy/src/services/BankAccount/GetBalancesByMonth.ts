import { httpsCallable } from "firebase/functions";
import { GetBalancesByMonthRequestSchemaType, GetBalancesByMonthResponseSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const GetBalancesByMonth = async (data: GetBalancesByMonthRequestSchemaType): Promise<GetBalancesByMonthResponseSchemaType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getBalancesByMonthFn = httpsCallable(functions, 'bank-getBalancesByMonth');
        const response = await getBalancesByMonthFn(data);
        console.log('Saldo da conta bancária atualizado:', response.data);

        return response.data as GetBalancesByMonthResponseSchemaType;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
    return undefined;
}