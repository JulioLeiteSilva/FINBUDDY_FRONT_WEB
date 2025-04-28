import { Box, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";
import TopBar from "./topBar";
import { useSideBarStore } from "../store/sideBarStore";
import React from "react";

interface PanelContentProps {
    children: ReactNode;
    title: string;
    onOpenNewTransactionModal: () => void;
}

const Content = (props: PanelContentProps) => {
    const { children, title, onOpenNewTransactionModal } = props;
    const { isSideBarCollapsed } = useSideBarStore();
    const theme = useTheme();
    const drawerWidth = isSideBarCollapsed ? theme.spacing(7) : theme.spacing(24);

    const contentWidth = React.useMemo(() => {
        return `calc(100% - ${drawerWidth})`;
    }, [isSideBarCollapsed]);
    console.log('Content width:', contentWidth);
    return (
        <Box component="main" >
            <TopBar onOpenNewTransactionModal={onOpenNewTransactionModal} />
            <Box
                sx={{
                    mt: 10,
                    ml: 5
                }}>
                <Typography variant="h4" component="div" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                {children}
            </Box>
        </Box>
    );
}
export default Content