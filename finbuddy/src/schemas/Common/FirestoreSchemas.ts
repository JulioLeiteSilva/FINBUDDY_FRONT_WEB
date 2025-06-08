import { z } from 'zod';

export const firestoreIdSchema = z.string().length(20, { message: "Selecione um item" }).regex(/^[a-zA-Z0-9]+$/);