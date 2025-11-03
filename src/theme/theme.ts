import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    cssVariables: {
        colorSchemeSelector: 'data-mui-color-scheme'
    },
    defaultColorScheme: 'light',
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: '#1976d2'
                },
                secondary: {
                    main: '#dc004e'
                },
                background: {
                    default: '#f5f5f5',
                    paper: '#ffffff'
                },
                action: {
                    hover: 'rgba(0, 0, 0, 0.08)',
                    selected: 'rgba(25, 118, 210, 0.12)',
                    selectedOpacity: 0.12,
                    hoverOpacity: 0.08
                }
            }
        },
        dark: {
            palette: {
                primary: {
                    main: '#90caf9'
                },
                secondary: {
                    main: '#f48fb1'
                },
                background: {
                    default: '#121212',
                    paper: '#1e1e1e'
                },
                action: {
                    hover: 'rgba(255, 255, 255, 0.12)',
                    selected: 'rgba(144, 202, 249, 0.16)',
                    selectedOpacity: 0.16,
                    hoverOpacity: 0.12
                }
            }
        }
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500
        },
        h3: {
            fontSize: '1.75rem',
            fontWeight: 500
        },
        h4: {
            fontSize: '1.5rem',
            fontWeight: 500
        },
        h5: {
            fontSize: '1.25rem',
            fontWeight: 500
        },
        h6: {
            fontSize: '1rem',
            fontWeight: 500
        }
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: '1px solid',
                    borderColor: 'divider'
                }
            }
        }
    }
});

export default theme;
