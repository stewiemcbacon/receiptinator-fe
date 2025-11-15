import { useState, ReactNode } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme, Fab } from '@mui/material';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import Header from './Header';
import Sidebar from './Sidebar';
import ReceiptUpload from '../ReceiptUpload';

interface AppLayoutProps {
    children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);
    const [desktopOpen, setDesktopOpen] = useState(true);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const handleMobileDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleDesktopDrawerToggle = () => {
        setDesktopOpen(!desktopOpen);
    };

    const handleUploadClick = () => {
        setUploadDialogOpen(true);
    };

    const handleUploadClose = () => {
        setUploadDialogOpen(false);
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

            {/* Floating Action Button for Receipt Upload */}
            <Fab
                color="primary"
                aria-label="upload receipt"
                onClick={handleUploadClick}
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    zIndex: 1000
                }}
            >
                <AddAPhotoIcon />
            </Fab>

            {/* Receipt Upload Dialog */}
            <ReceiptUpload
                open={uploadDialogOpen}
                onClose={handleUploadClose}
            />
        </Box>
    );
};

export default AppLayout;
