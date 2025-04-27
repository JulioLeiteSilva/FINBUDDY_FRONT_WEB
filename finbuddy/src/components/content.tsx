import { Box } from "@mui/material";
import { ReactNode } from "react";
import TopBar from "./topBar";

interface PanelContentProps {
    children: ReactNode;
}

const Content = (props: PanelContentProps) => {
    const { children } = props;
    return (
        <Box
            component="main"
            sx={{
                width: '100%',
            }}
        >
            <TopBar />
            <Box
                sx={{
                    width: '100%',
                    mt: 20 
                }}>
                    {children}
                </Box>
        </Box>
    );
}
export default Content