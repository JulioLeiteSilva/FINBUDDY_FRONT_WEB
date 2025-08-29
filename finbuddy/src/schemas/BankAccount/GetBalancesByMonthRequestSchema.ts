import { z } from 'zod';

export const GetBalancesByMonthRequestSchema = z.object({
    month: z.string(),
});