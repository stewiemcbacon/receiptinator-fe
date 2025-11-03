import {
    Drawer,
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Tooltip
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import InfoIcon from '@mui/icons-material/Info';
import { ReactElement } from 'react';

const drawerWidth = 240;
const miniDrawerWidth = 64;

interface MenuItem {
    text: string;
    icon: ReactElement;
    path: string;
}

const menuItems: MenuItem[] = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
    { text: 'About', icon: <InfoIcon />, path: '/about' }
];

interface SidebarProps {
    mobileOpen: boolean;
    desktopOpen: boolean;
    onMobileClose: () => void;
    onDesktopToggle: () => void;
    isMobile: boolean;
}

const Sidebar = ({ mobileOpen, desktopOpen, onMobileClose, isMobile }: SidebarProps) => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            onMobileClose();
        }
    };

    const drawer = (isOpen: boolean) => (
        <Box>
            {/*<Toolbar>*/}
            {/*  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'center' }}>*/}
            {/*    /!* You can add a logo here *!/*/}
            {/*  </Box>*/}
            {/*</Toolbar>*/}
            <Divider />
            <List>
                {menuItems.map((item) => (
                    <ListItem
                        key={item.text}
                        disablePadding
                        sx={{ display: 'block' }}
                    >
                        <Tooltip
                            title={!isOpen ? item.text : ''}
                            placement="right"
                            arrow
                        >
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                selected={location.pathname === item.path}
                                sx={{
                                    minHeight: 48,
                                    justifyContent: isOpen ? 'initial' : 'center',
                                    px: 2.5,
                                    '&:hover': {
                                        backgroundColor: 'action.hover'
                                    },
                                    '&.Mui-selected': {
                                        backgroundColor: 'action.selected'
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: 'action.selected'
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: isOpen ? 3 : 'auto',
                                        justifyContent: 'center',
                                        color: location.pathname === item.path ? 'primary.main' : 'text.primary'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.text}
                                    sx={{ opacity: isOpen ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </Tooltip>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{
                width: { md: desktopOpen ? drawerWidth : miniDrawerWidth },
                flexShrink: { md: 0 }
            }}
            aria-label="navigation menu"
        >
            {/* Mobile drawer */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onMobileClose}
                ModalProps={{
                    keepMounted: true // Better open performance on mobile
                }}
                sx={{
                    display: { xs: 'block', md: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                }}
            >
                {drawer(true)}
            </Drawer>
            {/* Desktop drawer */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', md: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: desktopOpen ? drawerWidth : miniDrawerWidth,
                        transition: (theme) =>
                            theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: theme.transitions.duration.leavingScreen
                            }),
                        overflowX: 'hidden'
                    }
                }}
                open
            >
                {drawer(desktopOpen)}
            </Drawer>
        </Box>
    );
};

export default Sidebar;
