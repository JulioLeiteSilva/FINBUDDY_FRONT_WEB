import { httpsCallable } from "firebase/functions";
import { UpdateBankAccountBalanceDTOSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";

export const UpdateBankAccountBalance = async (
    data: UpdateBankAccountBalanceDTOSchemaType & { id: string }  // 👈 precisa conter o id embutido
) => {
    try {
        const updateBankAccountBalanceFn = httpsCallable(functions, 'bank-updateBankAccountBalance');
        const response = await updateBankAccountBalanceFn(data); // 👈 enviando tudo como `data`
        console.log('Saldo da conta bancária atualizado:', response);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();
    } catch (error) {
        console.error('Erro ao atualizar saldo da conta bancária:', error);
    }
}