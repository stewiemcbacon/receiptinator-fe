import { Container, Typography, Paper, Box, Card, CardContent } from '@mui/material';
import Grid from '@mui/material/Grid2';
import CodeIcon from '@mui/icons-material/Code';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DevicesIcon from '@mui/icons-material/Devices';
import SpeedIcon from '@mui/icons-material/Speed';
import { ReactElement } from 'react';

interface Feature {
    title: string;
    description: string;
    icon: ReactElement;
}

const features: Feature[] = [
    {
        title: 'React 18',
        description: 'Built with the latest React features and best practices',
        icon: <CodeIcon sx={{ fontSize: 40 }} />
    },
    {
        title: 'Dark Mode',
        description: 'Seamless light and dark theme toggle with persistence',
        icon: <DarkModeIcon sx={{ fontSize: 40 }} />
    },
    {
        title: 'Responsive',
        description: 'Fully responsive design for mobile and desktop',
        icon: <DevicesIcon sx={{ fontSize: 40 }} />
    },
    {
        title: 'Vite Powered',
        description: 'Lightning fast development with Vite build tool',
        icon: <SpeedIcon sx={{ fontSize: 40 }} />
    }
];

const Home = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 2,
                        background: (theme) =>
                            theme.palette.mode === 'light'
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : 'linear-gradient(135deg, #1e3a8a 0%, #312e81 100%)',
                        color: 'white'
                    }}
                >
                    <Typography
                        variant="h2"
                        component="h1"
                        gutterBottom
                        fontWeight={600}
                    >
                        Welcome to React Skeleton
                    </Typography>
                    <Typography
                        variant="h6"
                        sx={{ opacity: 0.9 }}
                    >
                        A modern React application template with Material-UI, Vite, and responsive design
                    </Typography>
                </Paper>

                <Grid
                    container
                    spacing={3}
                >
                    {features.map((feature, index) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 3 }}
                            key={index}
                        >
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)'
                                    }
                                }}
                            >
                                <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                                    <Box sx={{ color: 'primary.main', mb: 2 }}>{feature.icon}</Box>
                                    <Typography
                                        variant="h6"
                                        component="h2"
                                        gutterBottom
                                    >
                                        {feature.title}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        {feature.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Paper sx={{ p: 4, mt: 4 }}>
                    <Typography
                        variant="h5"
                        gutterBottom
                    >
                        Getting Started
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                    >
                        This is a skeleton React application featuring:
                    </Typography>
                    <Box
                        component="ul"
                        sx={{ color: 'text.secondary' }}
                    >
                        <li>Material-UI components for beautiful UI</li>
                        <li>Retractable sidebar navigation</li>
                        <li>Dark/Light theme toggle</li>
                        <li>Responsive design for all screen sizes</li>
                        <li>React Router for navigation</li>
                        <li>Vite for fast development and builds</li>
                    </Box>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Try toggling the theme using the button in the top right corner, or explore the navigation menu!
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default Home;
