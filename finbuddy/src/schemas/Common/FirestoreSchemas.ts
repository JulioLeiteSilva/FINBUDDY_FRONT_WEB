import { z } from 'zod';

export const firestoreIdSchema = z.string().length(20).regex(/^[a-zA-Z0-9]+$/);