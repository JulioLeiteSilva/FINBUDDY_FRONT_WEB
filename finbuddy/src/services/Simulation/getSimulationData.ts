import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";
import { GetSimulationDataResponseType } from "../../schemas/Simulation/Simulation";

export const GetSimulationData = async (): Promise<GetSimulationDataResponseType | undefined> => {
    const { showSnackbar } = useSnackbarStore.getState();

    try {
        const getSimulationDataFn = httpsCallable(functions, 'simulation-getSimulationData');
        const response = await getSimulationDataFn();

        return response.data as GetSimulationDataResponseType;
    } catch (error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const errorCode = (error as any)?.code || 'unknown';
        const message = getFirebaseAuthErrorMessage(errorCode);
        showSnackbar(message, 'error');
    }
    return undefined;
}