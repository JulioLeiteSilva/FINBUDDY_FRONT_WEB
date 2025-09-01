/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { CreateBankAccountRequestType } from "../../schemas/BankAccount";

export const CreateBankAccount = async (
    body: CreateBankAccountRequestType
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const createBankAccountFn = httpsCallable(functions, 'bank-createBankAccount');
        const response = await createBankAccountFn(body.data);
        console.log('Conta bancária criada:', response.data);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();
        await

        showSnackbar('Conta bancária criada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
};
