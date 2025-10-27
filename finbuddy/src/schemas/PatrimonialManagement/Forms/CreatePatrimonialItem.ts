import { z } from 'zod';
import { AssetSubtype, AssetType, patrimonialItemCategory, TangibleGoodsType } from '../../../enums/patrimonialManagement';

const positiveNumber = (message = "Valor deve ser positivo") =>
    z.coerce.number({ invalid_type_error: "Valor inválido" }).positive(message);

const nonNegativeNumber = (message = "Valor não pode ser negativo") =>
    z.coerce.number({ invalid_type_error: "Valor inválido" }).min(0, message);


const baseFormSchema = z.object({
    patrimonyType: z.nativeEnum(patrimonialItemCategory, {
        required_error: "Selecione Ativo ou Passivo",
    }),
    assetSubtype: z.nativeEnum(AssetSubtype).optional(),
    name: z.string().optional(),
    totalDebtAmount: positiveNumber().optional(),
    interestRate: nonNegativeNumber().max(100, "Taxa não pode ser > 100%").optional(),
    term: z.coerce.number().int("Deve ser um número inteiro").positive("Prazo deve ser positivo").optional(),
    installmentValue: positiveNumber().optional(),
    assetType: z.nativeEnum(AssetType).optional(),
    quantity: positiveNumber().optional(),
    avgCost: positiveNumber().optional(),
    tag: z.string().optional(),
    type: z.nativeEnum(TangibleGoodsType).optional(),
    observationValue: positiveNumber().optional(),
    initialValue: positiveNumber().optional(),
});

export const formPatrimonySchema = baseFormSchema.superRefine((data, ctx) => {

    // CASO 1: É 'PASSIVO'
    if (data.patrimonyType === patrimonialItemCategory.LIABILITY) {
        if (!data.name?.trim()) { // .trim() para evitar só espaços
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['name'], message: 'O nome da dívida é obrigatório' });
        }
        if (data.totalDebtAmount === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['totalDebtAmount'], message: 'Valor total é obrigatório' });
        }
        if (data.interestRate === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['interestRate'], message: 'Taxa de juros é obrigatória' });
        }
        if (data.term === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['term'], message: 'Prazo é obrigatório' });
        }
        if (data.installmentValue === undefined) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['installmentValue'], message: 'Valor da parcela é obrigatório' });
        }
    }

    // CASO 2: É 'ATIVO'
    if (data.patrimonyType === patrimonialItemCategory.ASSET) {
        // 2a: Validar se o subtype foi escolhido
        if (!data.assetSubtype) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ['assetSubtype'],
                message: 'Selecione o tipo de ativo (Ativos Financeiros ou Bens Materiais)',
            });
            // Retornar aqui é importante. Não adianta validar os campos internos
            // se o tipo de ativo nem foi selecionado.
            return;
        }

        // 2b: É 'ativo' E 'Acoes' (Ativo Financeiro)
        if (data.assetSubtype === AssetSubtype.ASSETS) {
            if (!data.assetType) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['assetType'], message: 'O tipo de ativo financeiro é obrigatório' });
            }
            if (!data.name?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['name'], message: 'O nome do ativo é obrigatório' });
            }
            if (data.quantity === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['quantity'], message: 'Quantidade é obrigatória' });
            }
            if (data.avgCost === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['avgCost'], message: 'Custo médio é obrigatório' });
            }
        }

        // 2c: É 'ativo' E 'Bens Materiais' (Ativo Tangível)
        if (data.assetSubtype === AssetSubtype.TANGIBLE_GOODS) {
            if (!data.type) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['type'], message: 'O tipo de bem é obrigatório' });
            }
            if (!data.name?.trim()) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['name'], message: 'O nome/descrição é obrigatório' });
            }
            if (data.observationValue === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['observationValue'], message: 'Valor de observação é obrigatório' });
            }
            if (data.initialValue === undefined) {
                ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['initialValue'], message: 'Valor inicial é obrigatório' });
            }
        }
    }
});

// Tipo inferido para o seu useForm
export type FormPatrimonyType = z.infer<typeof formPatrimonySchema>;