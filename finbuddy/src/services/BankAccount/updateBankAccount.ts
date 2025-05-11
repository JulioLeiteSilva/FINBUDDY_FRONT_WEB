import { httpsCallable } from "firebase/functions";
import { UpdateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";

export const UpdateBankAccount = async (
    data: UpdateBankAccountDTOSchemaType & { id: string }) => {
    try {
        const updateBankAccountFn = httpsCallable(functions, 'bank-updateBankAccount');
        const response = await updateBankAccountFn(data);
        console.log('Conta bancária atualizada:', response);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();
    } catch (error) {
        console.error('Erro ao atualizar conta bancária:', error);
    }
}