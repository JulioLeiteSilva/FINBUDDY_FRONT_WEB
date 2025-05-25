import { z } from 'zod';
import { CategorySchema } from './CategorySchema';

export const CategoriesResponseDTOSchema = z.object({
    message: z.string(),
    categories: z.array(CategorySchema)
});