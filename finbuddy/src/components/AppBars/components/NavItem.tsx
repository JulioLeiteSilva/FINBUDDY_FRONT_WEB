// src/components/NavItem.jsx
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { NavLink } from "react-router-dom";
import { useSideBarStore } from "../../../store/sideBarStore";

interface NavItemProps {
    path: string;
    icon: React.ReactNode;
    text: string;
};

const NavItem: React.FC<NavItemProps> = ({ path, icon, text }) => {
    const { isSideBarCollapsed } = useSideBarStore();

    return (
        <ListItem disablePadding sx={{ display: 'block' }}>
            <NavLink
                to={path}
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
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} sx={{ opacity: isSideBarCollapsed ? 0 : 1 }} />
                </ListItemButton>
            </NavLink>
        </ListItem>
    );
};

export default NavItem;