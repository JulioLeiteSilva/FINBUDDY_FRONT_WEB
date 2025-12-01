export enum patrimonialItemCategory {
    ASSET = "Asset",
    LIABILITY = "Liability"
}

export function mapPatrimonialCategoryToPortuguese(category: patrimonialItemCategory): string {
    switch (category) {
        case patrimonialItemCategory.ASSET:
            return 'Ativo';
        case patrimonialItemCategory.LIABILITY:
            return 'Passivo';
        default:
            throw new Error(`Categoria patrimonial desconhecida: ${category}`);
    }
}

export enum AssetSubtype {
    ASSETS = "ASSETS",
    TANGIBLE_GOODS = "TANGIBLE_GOODS"
}

export enum TangibleGoodsType {
    VEHICLE = "VEHICLE",
    REAL_ESTATE = "REAL_ESTATE",
    JEWELRY = "JEWELRY",
    ELECTRONICS = "ELECTRONICS",
    ART = "ART",
    FURNITURE = "FURNITURE",
    OTHER = "OTHER",
}

export enum AssetType {
    FIXED_INCOME = "FIXED_INCOME",
    STOCKS = "STOCKS",
    REIT = "REIT",
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
}

export function mapAssetSubtypeToPortuguese(subtype: AssetSubtype): string {
    switch (subtype) {
        case AssetSubtype.ASSETS:
            return 'Ativos Financeiros'; // "Ativos Financeiros" é mais claro que apenas "Ativos" nesse contexto
        case AssetSubtype.TANGIBLE_GOODS:
            return 'Bens Tangíveis';
        default:
            throw new Error(`Subtipo de ativo desconhecido: ${subtype}`);
    }
}

export function mapTangibleGoodsTypeToPortuguese(type: TangibleGoodsType): string {
    switch (type) {
        case TangibleGoodsType.VEHICLE:
            return 'Veículo';
        case TangibleGoodsType.REAL_ESTATE:
            return 'Imóvel';
        case TangibleGoodsType.JEWELRY:
            return 'Joias';
        case TangibleGoodsType.ELECTRONICS:
            return 'Eletrônicos';
        case TangibleGoodsType.ART:
            return 'Arte';
        case TangibleGoodsType.FURNITURE:
            return 'Mobília';
        case TangibleGoodsType.OTHER:
            return 'Outros';
        default:
            throw new Error(`Tipo de bem tangível desconhecido: ${type}`);
    }
}

export function mapAssetTypeToPortuguese(type: AssetType): string {
    switch (type) {
        case AssetType.FIXED_INCOME:
            return 'Renda Fixa';
        case AssetType.STOCKS:
            return 'Ações';
        case AssetType.REIT:
            return 'Fundos Imobiliários'; // Tradução padrão para REITs no Brasil (FIIs)
        case AssetType.CRYPTOCURRENCY:
            return 'Criptomoedas';
        default:
            throw new Error(`Tipo de ativo financeiro desconhecido: ${type}`);
    }
}