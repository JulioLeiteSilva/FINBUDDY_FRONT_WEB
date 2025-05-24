/* eslint-disable @typescript-eslint/no-explicit-any */
import { httpsCallable } from "firebase/functions";
import { CategoryRequestDTOSchemaType } from "../../schemas/Categories";
import { functions } from "../firebase";
import { useCategoriesStore } from "../../store/categoriesStore";
import { useSnackbarStore } from "../../store/useSnackbarStore";
import { getFirebaseAuthErrorMessage } from "../../utils/firebaseErrorMenssages";

export const CreateCategory = async (
  data: CategoryRequestDTOSchemaType
) => {
  const { showSnackbar } = useSnackbarStore.getState();

  try {
    const createCategoryFn = httpsCallable(functions, 'category-createCategory');
    const response = await createCategoryFn(data);
    console.log('Categoria criada:', response.data);

    const { fetchCategories } = useCategoriesStore.getState();
    await fetchCategories();

    showSnackbar('Categoria criada com sucesso!', 'success');
  } catch (error) {
    const errorCode = (error as any)?.code || 'unknown';
    const message = getFirebaseAuthErrorMessage(errorCode);
    showSnackbar(message, 'error');
    console.error('Erro ao criar categoria:', error);
  }
};