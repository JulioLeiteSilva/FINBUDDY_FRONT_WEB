import { z } from 'zod';
import { CategorySchema } from './categorySchema';
import { CategoryRequestDTOSchema } from './categoryRequestDTOSchema';

export { CategorySchema, CategoryRequestDTOSchema };

export type CategorySchemaType = z.infer<typeof CategorySchema>;
export type CategoryRequestDTOSchemaType = z.infer<typeof CategoryRequestDTOSchema>;