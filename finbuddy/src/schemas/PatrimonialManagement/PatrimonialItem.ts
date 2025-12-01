import { z } from 'zod';
import { AssetType, patrimonialItemCategory, TangibleGoodsType } from '../../enums/patrimonialManagement';

// ------------------------------------------------------------------
// 1. DEFINIÇÃO DOS SCHEMAS "BASE" (Dados puros, sem histórico ainda)
// ------------------------------------------------------------------

// Schema base genérico
const basePatrimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  onCreate: z.coerce.date(), // Usei coerce para garantir datas vindas de JSON
  category: z.nativeEnum(patrimonialItemCategory),
});

// Base Asset (Sem histórico)
export const baseAssetItemSchema = basePatrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.ASSET),
  AssetType: z.nativeEnum(AssetType),
  quantity: z.number(),
  avgCost: z.number(),
  value: z.number(),
});

// Base Tangible (Sem histórico)
export const baseTangibleGoodsItemSchema = basePatrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.ASSET),
  type: z.nativeEnum(TangibleGoodsType),
  description: z.string().optional(),
  obersationValue: z.number(),
  initialValue: z.number(),
});

// Base Liability (Sem histórico)
export const baseLiabilityItemSchema = basePatrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.LIABILITY),
  totalDebtAmount: z.number(),
  updatedDebtsAmount: z.number(),
  interestRate: z.number(),
  term: z.number(),
  installmentValue: z.number(),
});

// União dos tipos Base (Usado pelo Histórico para saber o que mudou)
const baseAnyPatrimonialItemSchema = z.union([
  baseAssetItemSchema,
  baseTangibleGoodsItemSchema,
  baseLiabilityItemSchema,
]);

// ------------------------------------------------------------------
// 2. DEFINIÇÃO DO SCHEMA DE HISTÓRICO (Usa os Bases)
// ------------------------------------------------------------------
// Se preferir manter em arquivo separado, exporte os 'base...' acima e importe aqui.
// Mas manter junto evita muitos problemas de importação circular.

export const historyEntrySchema = z.object({
  id: z.string(),
  timestamp: z.date(),
  // Aqui usamos o BASE, pois o histórico salva um snapshot dos dados, 
  // não precisamos salvar o histórico dentro do histórico (recursão infinita).
  changes: baseAnyPatrimonialItemSchema 
});

// ------------------------------------------------------------------
// 3. DEFINIÇÃO DOS SCHEMAS FINAIS (Base + Histórico)
// ------------------------------------------------------------------

export const assetItemSchema = baseAssetItemSchema.extend({
  history: z.array(historyEntrySchema),
});

export const tangibleGoodsItemSchema = baseTangibleGoodsItemSchema.extend({
  history: z.array(historyEntrySchema),
});

export const liabilityItemSchema = baseLiabilityItemSchema.extend({
  history: z.array(historyEntrySchema),
});

// União Final (O que você usa na sua aplicação principal)
export const anyPatrimonialItemSchema = z.union([
  assetItemSchema,
  tangibleGoodsItemSchema,
  liabilityItemSchema,
]);

// ------------------------------------------------------------------
// 4. EXPORTAÇÃO DOS TIPOS INFERIDOS
// ------------------------------------------------------------------

export type PatrimonialItemType = z.infer<typeof basePatrimonialItemSchema> & { history: z.infer<typeof historyEntrySchema>[] };
export type AssetItemType = z.infer<typeof assetItemSchema>;
export type TangibleGoodsItemType = z.infer<typeof tangibleGoodsItemSchema>;
export type LiabilityItemType = z.infer<typeof liabilityItemSchema>;
export type AnyPatrimonialItemType = z.infer<typeof anyPatrimonialItemSchema>;
export type HistoryEntryType = z.infer<typeof historyEntrySchema>;