import { Container, Typography, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Grid2';

const Dashboard = () => {
    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                >
                    Dashboard
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                >
                    This is a placeholder dashboard page. Add your dashboard content here.
                </Typography>
                <Grid
                    container
                    spacing={3}
                >
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Metric 1
                            </Typography>
                            <Typography
                                variant="h4"
                                color="primary"
                            >
                                1,234
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Metric 2
                            </Typography>
                            <Typography
                                variant="h4"
                                color="secondary"
                            >
                                567
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                            >
                                Metric 3
                            </Typography>
                            <Typography
                                variant="h4"
                                color="success.main"
                            >
                                89%
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Dashboard;
