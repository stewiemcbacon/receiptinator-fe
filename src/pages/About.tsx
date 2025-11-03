import { Container, Typography, Paper, Box } from '@mui/material';

const About = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                >
                    About
                </Typography>
                <Paper sx={{ p: 3, mt: 3 }}>
                    <Typography
                        variant="h6"
                        gutterBottom
                    >
                        React Skeleton Application
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        paragraph
                    >
                        This is a modern React application template built with:
                    </Typography>
                    <Box
                        component="ul"
                        sx={{ color: 'text.secondary' }}
                    >
                        <li>React 18 - Latest version with modern hooks and patterns</li>
                        <li>Vite 6 - Next generation frontend tooling</li>
                        <li>Material-UI v6 - Comprehensive React component library</li>
                        <li>React Router v6 - Declarative routing for React</li>
                        <li>Emotion - Performant and flexible CSS-in-JS library</li>
                        <li>TypeScript - Type-safe development</li>
                    </Box>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        Version 1.0.0
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
};

export default About;
