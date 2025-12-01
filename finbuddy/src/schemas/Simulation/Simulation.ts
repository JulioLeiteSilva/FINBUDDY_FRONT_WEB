import { z } from 'zod';
import { FunctionsGenericResponseSchema } from '../Common';

// Sub-schemas auxiliares
const AssetSchema = z.object({
    name: z.string().min(1),
    value: z.number(),
    category: z.enum(['Asset', 'Liability']),
});

const FinancialItemSchema = z.object({
    name: z.string().min(1),
    value: z.number(),
    category: z.string().min(1),
});

const CategoryAverageSchema = z.object({
    category: z.string().min(1),
    averageValue: z.number(),
});

// Schema Principal
export const SimulationSchema = z.object({
    inputs: z.object({
        assets: z.array(AssetSchema),
        fixedIncomes: z.array(FinancialItemSchema),
        averageIncomesByCategory: z.array(CategoryAverageSchema),
    }),
    outputs: z.object({
        debts: z.array(FinancialItemSchema),
        fixedExpenses: z.array(FinancialItemSchema),
        averageExpensesByCategory: z.array(CategoryAverageSchema),
    }),
});

export const GetSimulationDataResponseSchema = FunctionsGenericResponseSchema.extend({
    data: z.array(SimulationSchema),
});

export type SimulationType = z.infer<typeof SimulationSchema>;
export type GetSimulationDataResponseType = z.infer<typeof GetSimulationDataResponseSchema>;