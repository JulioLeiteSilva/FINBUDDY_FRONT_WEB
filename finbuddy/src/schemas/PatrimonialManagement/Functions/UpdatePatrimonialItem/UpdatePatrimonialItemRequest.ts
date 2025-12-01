import z from "zod";
import {
    assetItemSchema,
    tangibleGoodsItemSchema,
    liabilityItemSchema
} from "../../PatrimonialItem"; // Importe os schemas individuais

// Criamos uma versão de update para CADA tipo específico
// 1. Torna tudo opcional (.partial())
// 2. Força o ID a ser obrigatório novamente (.extend())

const updateAssetSchema = assetItemSchema.partial().extend({
    id: z.string()
});

const updateTangibleSchema = tangibleGoodsItemSchema.partial().extend({
    id: z.string()
});

const updateLiabilitySchema = liabilityItemSchema.partial().extend({
    id: z.string()
});

// Cria a união dos schemas de update
export const UpdatePatrimonialItemRequestSchema = z.union([
    updateAssetSchema,
    updateTangibleSchema,
    updateLiabilitySchema
]);

export type UpdatePatrimonialItemRequestType = z.infer<typeof UpdatePatrimonialItemRequestSchema>;