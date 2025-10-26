/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { CreateBankAccountRequestType } from "../../schemas/BankAccount";
import dayjs from "dayjs";

export const CreateBankAccount = async (
    body: CreateBankAccountRequestType,
    month: string,
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const createBankAccountFn = httpsCallable(functions, 'bank-createBankAccount');
        const response = await createBankAccountFn(body);
        console.log('Conta bancária criada:', response.data);

        const { fetchBankAccountsBalancesByMonth } = useBankAccountStore.getState();
        await fetchBankAccountsBalancesByMonth({ month: month ?? dayjs().tz("America/Sao_Paulo").format('YYYY-MM').toString() });

        showSnackbar('Conta bancária criada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
};
