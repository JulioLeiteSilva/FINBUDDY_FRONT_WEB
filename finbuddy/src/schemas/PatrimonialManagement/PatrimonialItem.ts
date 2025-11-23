import { z } from 'zod';
import { AssetType, patrimonialItemCategory, TangibleGoodsType } from '../../enums/patrimonialManagement';

export const patrimonialItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  onCreate: z.date(),
  category: z.nativeEnum(patrimonialItemCategory),
});

export const assetItemSchema = patrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.ASSET),
  AssetType: z.nativeEnum(AssetType),
  quantity: z.number(),
  avgCost: z.number(),
});

export const tangibleGoodsItemSchema = patrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.ASSET),
  type: z.nativeEnum(TangibleGoodsType),
  description: z.string().optional(),
  obersationValue: z.number(),
  initialValue: z.number(),
});

export const liabilityItemSchema = patrimonialItemSchema.extend({
  category: z.literal(patrimonialItemCategory.LIABILITY),
  totalDebtAmount: z.number(),
  updatedDebtsAmount: z.number(),
  interestRate: z.number(),
  term: z.number(),
  installmentValue: z.number(),
});

export const anyPatrimonialItemSchema = z.union([
  assetItemSchema,
  tangibleGoodsItemSchema,
  liabilityItemSchema,
]);

export type PatrimonialItemType = z.infer<typeof patrimonialItemSchema>;
export type AssetItemType = z.infer<typeof assetItemSchema>;
export type TangibleGoodsItemType = z.infer<typeof tangibleGoodsItemSchema>;
export type LiabilityItemType = z.infer<typeof liabilityItemSchema>;
export type AnyPatrimonialItemType = z.infer<typeof anyPatrimonialItemSchema>;