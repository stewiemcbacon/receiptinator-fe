import { useState } from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Switch,
    Checkbox,
    Radio,
    RadioGroup,
    Divider,
    Stack
} from '@mui/material';
import * as React from 'react';

const Settings = () => {
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        sms: false
    });

    const [features, setFeatures] = useState({
        darkMode: false,
        animations: true,
        autoSave: true
    });

    const [language, setLanguage] = useState('english');
    const [theme, setTheme] = useState('auto');

    const handleNotificationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNotifications({
            ...notifications,
            [event.target.name]: event.target.checked
        });
    };

    const handleFeatureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFeatures({
            ...features,
            [event.target.name]: event.target.checked
        });
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ my: 4 }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                >
                    Settings
                </Typography>
                <Typography
                    variant="body1"
                    color="text.secondary"
                    paragraph
                >
                    Configure your application preferences and notifications.
                </Typography>

                <Stack
                    spacing={3}
                    sx={{ mt: 3 }}
                >
                    {/* Notifications Section */}
                    <Paper sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Notifications
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Choose how you want to receive notifications
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={notifications.email}
                                        onChange={handleNotificationChange}
                                        name="email"
                                    />
                                }
                                label="Email notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={notifications.push}
                                        onChange={handleNotificationChange}
                                        name="push"
                                    />
                                }
                                label="Push notifications"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={notifications.sms}
                                        onChange={handleNotificationChange}
                                        name="sms"
                                    />
                                }
                                label="SMS notifications"
                            />
                        </FormGroup>
                    </Paper>

                    {/* Features Section */}
                    <Paper sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            gutterBottom
                        >
                            Features
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Enable or disable application features
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={features.darkMode}
                                        onChange={handleFeatureChange}
                                        name="darkMode"
                                    />
                                }
                                label="Dark mode"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={features.animations}
                                        onChange={handleFeatureChange}
                                        name="animations"
                                    />
                                }
                                label="Enable animations"
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={features.autoSave}
                                        onChange={handleFeatureChange}
                                        name="autoSave"
                                    />
                                }
                                label="Auto-save"
                            />
                        </FormGroup>
                    </Paper>

                    {/* Language Section */}
                    <Paper sx={{ p: 3 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Language</FormLabel>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Select your preferred language
                            </Typography>
                            <RadioGroup
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                            >
                                <FormControlLabel
                                    value="english"
                                    control={<Radio />}
                                    label="English"
                                />
                                <FormControlLabel
                                    value="spanish"
                                    control={<Radio />}
                                    label="Spanish"
                                />
                                <FormControlLabel
                                    value="french"
                                    control={<Radio />}
                                    label="French"
                                />
                                <FormControlLabel
                                    value="german"
                                    control={<Radio />}
                                    label="German"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>

                    {/* Theme Section */}
                    <Paper sx={{ p: 3 }}>
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Theme Preference</FormLabel>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 2 }}
                            >
                                Choose your color scheme preference
                            </Typography>
                            <RadioGroup
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                            >
                                <FormControlLabel
                                    value="auto"
                                    control={<Radio />}
                                    label="Auto (System default)"
                                />
                                <FormControlLabel
                                    value="light"
                                    control={<Radio />}
                                    label="Light"
                                />
                                <FormControlLabel
                                    value="dark"
                                    control={<Radio />}
                                    label="Dark"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Stack>
            </Box>
        </Container>
    );
};

export default Settings;
