import { Avatar, Box, Paper, Stack, Typography } from "@mui/material";
import GetMuiIcon from "../../../../utils/getMuiIcon";
import { patrimonialItemCategory, AssetType, TangibleGoodsType } from "../../../../enums/patrimonialManagement";
import { formatCurrency } from "../../../Home/utils/formatUtils";
import { getIconNameForPatrimonialItem } from "../../utils/PatrimonialManagementUtils";

export type PatrimonialItem = {
    id: string;
    name: string;
    category: string;
    value: number;
    type: patrimonialItemCategory | AssetType | TangibleGoodsType | null;
}

interface PatrimonialItemProps {
    patrimonialItem: PatrimonialItem;
}

export const PatrimonialItem = (props: PatrimonialItemProps) => {
    const { patrimonialItem } = props;
    if (!patrimonialItem) {
        return null;
    }
    return (
        <Paper>
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, p: 2 }}>
                <Avatar sx={{ bgcolor: patrimonialItem.type === patrimonialItemCategory.LIABILITY ? "error.main" : "success.main" }}>
                    <GetMuiIcon
                        iconName={getIconNameForPatrimonialItem(patrimonialItem.type)}
                        sx={{ color: "white" }}
                    />
                </Avatar>
                <Stack>
                    <Typography sx={{ flex: 1, fontSize: 20 }}>{patrimonialItem.name}</Typography>
                    <Typography sx={{ flex: 1, fontSize: 15 }}>{formatCurrency(patrimonialItem.value)}</Typography>
                </Stack>
            </Box>
        </Paper>
    );
}