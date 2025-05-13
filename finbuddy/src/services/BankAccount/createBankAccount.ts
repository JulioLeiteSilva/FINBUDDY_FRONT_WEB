/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { CreateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const CreateBankAccount = async (
    data: CreateBankAccountDTOSchemaType
) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const createBankAccountFn = httpsCallable(functions, 'bank-createBankAccount');
        const response = await createBankAccountFn(data);
        console.log('Conta bancária criada:', response.data);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();

        showSnackbar('Conta bancária criada com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
};
