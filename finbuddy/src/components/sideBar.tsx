import { Drawer, Toolbar, Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, useTheme } from "@mui/material"
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import HomeIcon from '@mui/icons-material/Home';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { useSideBarStore } from "../store/sideBarStore";
import { NavLink } from "react-router-dom";
import { Category } from "@mui/icons-material";
import { FinbuddyLogoHeader, FinbuddyLogoHeaderCollapsed } from "./Images";


const SideBar = () => {
    const { isSideBarCollapsed } = useSideBarStore();
    const theme = useTheme();
    const drawerWidth = isSideBarCollapsed ? theme.spacing(7) : theme.spacing(24);

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
                display: 'block', // Sempre visível em desktop
            }}
            variant="permanent" // Sempre permanente em desktop
            anchor="left"
            open // Sempre aberto em desktop
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
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <FinbuddyLogoHeaderCollapsed />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                )}
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <HomeIcon />
                            </ListItemIcon>
                            <ListItemText primary="Home" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/bank-accounts"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <AccountBalanceIcon />
                            </ListItemIcon>
                            <ListItemText primary="Contas Bancárias" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/categories"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <Category />
                            </ListItemIcon>
                            <ListItemText primary="Categorias" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/transactions"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <ReceiptLongIcon />
                            </ListItemIcon>
                            <ListItemText primary="Transações" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/cards"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <CreditCardIcon />
                            </ListItemIcon>
                            <ListItemText primary="Cartões" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
                <ListItem disablePadding sx={{ display: 'block' }}>
                    <NavLink
                        to="/dashboards"
                        className={({ isActive }) => isActive ? 'active' : ''}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <ListItemButton
                            sx={{
                                minHeight: 48,
                                justifyContent: isSideBarCollapsed ? 'center' : 'initial',
                                px: 2.5,
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: isSideBarCollapsed ? 'auto' : 3,
                                    justifyContent: 'center',
                                }}
                            >
                                <TrendingUpIcon />
                            </ListItemIcon>
                            <ListItemText primary="Dashboards" sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                        </ListItemButton>
                    </NavLink>
                </ListItem>
            </List>
        </Drawer>
    );
}
export default SideBar