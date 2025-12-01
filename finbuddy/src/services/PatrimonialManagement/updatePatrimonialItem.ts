/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { functions } from "../firebase";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { usePatrimonialManagementStore } from "../../store/patrimonialManagementStore";
import { UpdatePatrimonialItemRequestType } from "../../schemas/PatrimonialManagement/Functions/UpdatePatrimonialItem/UpdatePatrimonialItemRequest";

export const UpdatePatrimonialItem = async (body: UpdatePatrimonialItemRequestType) => {
    const { showSnackbar } = useSnackbarStore.getState();
    const { fetchPatrimonialItens } = usePatrimonialManagementStore.getState();

    try {
        console.log(body)
        const updatePatrimonialItemFn = httpsCallable(functions, 'patrimonialManagement-update');
        const response = await updatePatrimonialItemFn(body);
        await fetchPatrimonialItens();
        console.log('Item patrimonial atualizado:', response.data);

        showSnackbar('Item patrimonial atualizado com sucesso!', 'success');
    } catch (error) {
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
        console.error('Erro ao atualizar item patrimonial:', error);
    }
}