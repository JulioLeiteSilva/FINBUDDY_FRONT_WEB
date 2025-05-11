import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";

export const DeleteBankAccount = async (id: string) => {
    try {
        const deleteBankAccountFn = httpsCallable(functions, 'bank-deleteBankAccount');
        const response = await deleteBankAccountFn({ id });  // 👈 enviando { id }
        console.log('Conta bancária deletada:', response);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();  // 👈 atualiza a store após deletar
    } catch (error) {
        console.error('Erro ao deletar conta bancária:', error);
    }
}