import { httpsCallable } from "firebase/functions";
import { CreateBankAccountDTOSchemaType } from "../../schemas/BankAccount";
import { functions } from "../firebase";
import { useBankAccountStore } from "../../store/bankAccountStore";

export const CreateBankAccount = async (
    data: CreateBankAccountDTOSchemaType,
) => {
    try {
        const createBankAccountFn = httpsCallable(functions, 'bank-createBankAccount');
        const response = await createBankAccountFn(data);
        console.log(response);

        const { fetchBankAccounts } = useBankAccountStore.getState();
        await fetchBankAccounts();
    } catch (error) {
        console.error('Erro ao criar conta bancária:', error);
    }
}