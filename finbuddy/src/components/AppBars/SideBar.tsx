import { Drawer, Toolbar, Box, List, useTheme } from "@mui/material";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { Category } from "@mui/icons-material";
import { useSideBarStore } from "../../store/sideBarStore";
import { FinbuddyLogoHeader, FinbuddyLogoHeaderCollapsed } from "..";
import NavItem from "./components/NavItem";

const SideBar = () => {
    const { isSideBarCollapsed } = useSideBarStore();
    const theme = useTheme();
    const drawerWidth = isSideBarCollapsed ? theme.spacing(7) : theme.spacing(24);

    const navItems = [
        { path: "/", text: "Home", icon: <HomeIcon /> },
        { path: "/bank-accounts", text: "Contas Bancárias", icon: <AccountBalanceIcon /> },
        { path: "/categories", text: "Categorias", icon: <Category /> },
        { path: "/transactions", text: "Transações", icon: <ReceiptLongIcon /> },
        { path: "/cards", text: "Cartões", icon: <CreditCardIcon /> },
        { path: "/dashboard", text: "Dashboards", icon: <TrendingUpIcon /> },
    ];

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    transition: theme.transitions.create('width', {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.enteringScreen,
                    }),
                },
                display: 'block',
            }}
            variant="permanent"
            anchor="left"
            open
        >
            {!isSideBarCollapsed && (
                <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}>
                    <Box width={isSideBarCollapsed ? 60 : 150} height={44} overflow="hidden">
                        <FinbuddyLogoHeader />
                    </Box>
                </Toolbar>
            )}
            <List>
                {isSideBarCollapsed && (
                    <NavItem
                        path={"/"}
                        icon={<FinbuddyLogoHeaderCollapsed />}
                        text={""}
                    />
                )}
                {navItems.map((item, index) => (
                    <NavItem key={index} path={item.path} icon={item.icon} text={item.text} />
                ))}
            </List>
        </Drawer>
    );
}

export default SideBar;