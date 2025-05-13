/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const DeleteBankAccount = async (id: string) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const deleteBankAccountFn = httpsCallable(functions, 'bank-deleteBankAccount');
        const response = await deleteBankAccountFn({ id });
        console.log('Conta bancária deletada:', response.data);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();

        showSnackbar('Conta bancária deletada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao deletar conta bancária:', error);
    }
};
