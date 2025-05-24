import { z } from 'zod';
import { CategorySchema } from './CategorySchema';
import { CategoryRequestDTOSchema } from './CategoryRequestDTOSchema';
import { CategoriesResponseDTOSchema } from './CategoryResponseDTOSchema';

export { CategorySchema, CategoryRequestDTOSchema, CategoriesResponseDTOSchema };

export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type CategoriesResponseDTOSchemaType = z.infer<typeof CategoriesResponseDTOSchema>;
export type CategoryRequestDTOSchemaType = z.infer<typeof CategoryRequestDTOSchema>;