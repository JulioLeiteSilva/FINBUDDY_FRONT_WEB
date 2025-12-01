import { useMemo, useState } from "react";
import { patrimonialItemCategory } from "../../../../enums/patrimonialManagement";
import { AnyPatrimonialItemType, AssetItemType, LiabilityItemType, TangibleGoodsItemType } from "../../../../schemas/PatrimonialManagement/PatrimonialItem";
import { PatrimonialItem } from "../PatrimonialItem/PatrimonialItem";
import { Box, Button, Stack, Typography } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface PatrimonialItemListProps {
    PatrimonialItens: AnyPatrimonialItemType[];
    handleOpenDetails?: (item: AnyPatrimonialItemType) => void;
}

const ITEMS_PER_PAGE = 5;

export const PatrimonialItemList = ({ PatrimonialItens, handleOpenDetails }: PatrimonialItemListProps) => {
    console.log('PatrimonialItens received in PatrimonialItemList:', PatrimonialItens);
    const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);

    const formattedItems: PatrimonialItem[] = useMemo(() => {
        return PatrimonialItens.map((item) => {
            const baseItem = {
                id: item.id,
                name: item.name,
                category: item.category,
            };
            if (item.category === patrimonialItemCategory.LIABILITY) {
                const liability = item as LiabilityItemType;
                return {
                    ...baseItem,
                    value: liability.updatedDebtsAmount,
                    type: patrimonialItemCategory.LIABILITY,
                };
            }
            if ('AssetType' in item) {
                const asset = item as AssetItemType;
                return {
                    ...baseItem,
                    value: asset.value,
                    type: asset.AssetType,
                };
            }
            if ('type' in item) {
                const tangible = item as TangibleGoodsItemType;
                return {
                    ...baseItem,
                    value: tangible.obersationValue,
                    type: tangible.type,
                };
            }
            return {
                ...baseItem,
                value: 0,
                type: null
            };
        });
    }, [PatrimonialItens]);

    const visibleItems = formattedItems.slice(0, displayLimit);

    const hasMoreItems = displayLimit < formattedItems.length;

    const handleLoadMore = () => {
        setDisplayLimit((prev) => prev + ITEMS_PER_PAGE);
    };

    const onItemClick = (id: string) => {
        if (!handleOpenDetails) return;

        // Encontra o item original completo na lista de props baseada no ID
        const originalItem = PatrimonialItens.find((i) => i.id === id);

        if (originalItem) {
            handleOpenDetails(originalItem);
        }
    };

    return (
        <Stack gap={3}>
            {visibleItems.map((item) => (
                <Box
                    key={item.id}
                    onClick={() => onItemClick(item.id)}
                    sx={{
                        cursor: handleOpenDetails ? 'pointer' : 'default',
                        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s',
                        '&:hover': handleOpenDetails ? {
                            transform: 'scale(1.01)', // Leve zoom ao passar o mouse
                            // opcional: boxShadow: 3 
                        } : {}
                    }}
                >
                    <PatrimonialItem patrimonialItem={item} />
                </Box>
            ))}

            {hasMoreItems && (
                <Box display="flex" justifyContent="center" mt={2}>
                    <Button
                        variant="outlined"
                        onClick={handleLoadMore}
                        endIcon={<ExpandMoreIcon />}
                    >
                        Ver mais ({formattedItems.length - displayLimit} restantes)
                    </Button>
                </Box>
            )}

            {!hasMoreItems && formattedItems.length > 0 && (
                <Typography variant="caption" align="center" color="text.secondary">
                    Todos os itens foram carregados.
                </Typography>
            )}
        </Stack>
    );
};