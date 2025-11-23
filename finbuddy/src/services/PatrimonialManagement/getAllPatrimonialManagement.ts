import { httpsCallable } from "firebase/functions";
import { GetAllPatrimonialManagementResponseType } from "../../schemas/PatrimonialManagement/Functions/GetAllPatrimonialManagement/GetAllPatrimonialManagementResponse";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { functions } from "../firebase";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { FirebaseError } from "firebase/app";

export const GetAllPatrimonialManagement = async (): Promise<GetAllPatrimonialManagementResponseType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getAllPatrimonialManagementFn = httpsCallable(functions, 'patrimonialManagement-getAll');
        const response = await getAllPatrimonialManagementFn();

        return response.data as GetAllPatrimonialManagementResponseType;
    } catch (error) {
        const firebaseError = error as FirebaseError;
        const backendMessage = firebaseError.message;
        const fallbackMessage = getFirebaseAuthErrorMessage(firebaseError.code || 'unknown');
        const messageToShow = backendMessage || fallbackMessage;

        showSnackbar(messageToShow, 'error');
    }
    return undefined;
}