import { z } from 'zod';
import { CategorySchema } from './Category';

export const CategoriesResponseDTOSchema = z.object({
    message: z.string(),
    data: z.array(CategorySchema)
});