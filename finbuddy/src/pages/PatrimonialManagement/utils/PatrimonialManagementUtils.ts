import { patrimonialItemCategory, AssetType, TangibleGoodsType } from "../../../enums/patrimonialManagement";

export const getIconNameForPatrimonialItem = (itemType: patrimonialItemCategory | AssetType | TangibleGoodsType | null): string => {
    console.log('itemType', itemType);
    switch (itemType) {
        case patrimonialItemCategory.ASSET:
            return 'AccountBalanceIcon';
        case patrimonialItemCategory.LIABILITY:
            return 'MoneyOffIcon';
        case AssetType.CRYPTOCURRENCY:
            return 'CurrencyBitcoinIcon';
        case AssetType.STOCKS:
            return 'ShowChartIcon';
        case AssetType.FIXED_INCOME:
            return 'SavingsIcon';
        case AssetType.REIT:
            return 'DomainIcon';
        case TangibleGoodsType.REAL_ESTATE:
            return 'HomeIcon';
        case TangibleGoodsType.VEHICLE:
            return 'DirectionsCarIcon';
        case TangibleGoodsType.ART:
            return 'PaletteIcon';
        case TangibleGoodsType.ELECTRONICS:
            return 'DevicesIcon';
        case TangibleGoodsType.FURNITURE:
            return 'WeekendIcon';
        case TangibleGoodsType.JEWELRY:
            return 'DiamondIcon';
        case TangibleGoodsType.OTHER:
            return 'CategoryIcon';

        default:
            return 'HelpOutlineIcon';
    }
};