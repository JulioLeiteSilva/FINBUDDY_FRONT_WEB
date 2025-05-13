/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { UpdateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const UpdateBankAccount = async (
    data: UpdateBankAccountDTOSchemaType & { id: string }
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const updateBankAccountFn = httpsCallable(functions, 'bank-updateBankAccount');
        const response = await updateBankAccountFn(data);
        console.log('Conta bancária atualizada:', response.data);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();

        showSnackbar('Conta bancária atualizada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao atualizar conta bancária:', error);
    }
};
