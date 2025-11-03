import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const drawerWidth = 240;
const miniDrawerWidth = 64;

interface HeaderProps {
    onMenuClick: () => void;
    desktopOpen?: boolean;
}

const Header = ({ onMenuClick, desktopOpen = true }: HeaderProps) => {
    const { mode, setMode } = useColorScheme();

    const toggleTheme = () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
    };

    // Default to light mode if mode is not yet determined
    const currentMode = mode || 'light';

    return (
        <AppBar
            position="fixed"
            sx={{
                width: {
                    xs: '100%',
                    md: desktopOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${miniDrawerWidth}px)`
                },
                ml: {
                    xs: 0,
                    md: desktopOpen ? `${drawerWidth}px` : `${miniDrawerWidth}px`
                },
                transition: (theme) =>
                    theme.transitions.create(['width', 'margin'], {
                        easing: theme.transitions.easing.sharp,
                        duration: theme.transitions.duration.leavingScreen
                    })
            }}
        >
            <Toolbar sx={{ minHeight: { xs: 64, sm: 64 } }}>
                <IconButton
                    color="inherit"
                    aria-label="toggle drawer"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>
                <Typography
                    variant="h6"
                    noWrap
                    component="div"
                    sx={{ flexGrow: 1 }}
                >
                    React Skeleton App
                </Typography>
                <Box>
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        aria-label="toggle theme"
                    >
                        {currentMode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
