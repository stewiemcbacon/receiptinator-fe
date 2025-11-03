import { useState, ReactNode } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDesktopDrawerToggle = () => {
        setDesktopOpen(!desktopOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <Header
                onMenuClick={isMobile ? handleMobileDrawerToggle : handleDesktopDrawerToggle}
                desktopOpen={desktopOpen}
            />
            <Sidebar
                mobileOpen={mobileOpen}
                desktopOpen={desktopOpen}
                onMobileClose={handleMobileDrawerToggle}
                onDesktopToggle={handleDesktopDrawerToggle}
                isMobile={isMobile}
            />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    minHeight: '100vh'
                }}
            >
                <Toolbar sx={{ minHeight: { xs: 64, sm: 64 } }} />
                {children}
            </Box>
        </Box>
    );
};

export default AppLayout;
