/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { functions } from "../firebase";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { CreatePatrimonialItemRequestType } from "../../schemas/PatrimonialManagement/Functions/CreatePatrimonialItem/CreatePatrimonialItemRequest";

export const CreatePatrimonialItem = async (body: CreatePatrimonialItemRequestType) => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        console.log(body)
        const createPatrimonialItemFn = httpsCallable(functions, 'patrimonialManagement-create');
        const response = await createPatrimonialItemFn(body);
        console.log('Item patrimonial criado:', response.data);

        showSnackbar('Item patrimonial criado com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao criar conta bancária:', error);
    }
}