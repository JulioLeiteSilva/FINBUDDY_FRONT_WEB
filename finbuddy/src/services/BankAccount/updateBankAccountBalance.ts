/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { UpdateBankAccountBalanceRequestType } from "../../schemas/BankAccount";

export const UpdateBankAccountBalance = async (
    body: UpdateBankAccountBalanceRequestType
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const updateBankAccountBalanceFn = httpsCallable(functions, 'bank-updateBankAccountBalance');
        const response = await updateBankAccountBalanceFn(body);
        console.log('Saldo da conta bancária atualizado:', response.data);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();

        showSnackbar('Saldo da conta bancária atualizado com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao atualizar saldo da conta bancária:', error);
    }
};
