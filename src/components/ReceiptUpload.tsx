import React, { useRef, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    CircularProgress,
    Snackbar,
    Alert,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CloseIcon from '@mui/icons-material/Close';
import { uploadReceipt } from '../services/receipts.service';

interface ReceiptUploadProps {
    open: boolean;
    onClose: () => void;
    onUploadSuccess?: () => void;
}

const ReceiptUpload: React.FC<ReceiptUploadProps> = ({ open, onClose, onUploadSuccess }) => {
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            showSnackbar('Please select a valid image file', 'error');
            return;
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        if (file.size > maxSize) {
            showSnackbar('Image size must be less than 10MB', 'error');
            return;
        }

        await uploadFile(file);
    };

    const uploadFile = async (file: File) => {
        setUploading(true);
        onClose(); // Close the dialog immediately

        try {
            await uploadReceipt(file);
            showSnackbar('Receipt uploaded successfully!', 'success');
            onUploadSuccess?.();
        } catch (error: any) {
            console.error('Upload error:', error);

            // Extract error message from response
            let errorMessage = 'Failed to upload receipt. Please try again.';

            // Check if error response contains a message from n8n
            if (error?.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error?.message) {
                errorMessage = error.message;
            }

            showSnackbar(errorMessage, 'error');
        } finally {
            setUploading(false);
            // Reset input values to allow uploading the same file again
            if (cameraInputRef.current) cameraInputRef.current.value = '';
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCameraClick = () => {
        cameraInputRef.current?.click();
    };

    const handleFileClick = () => {
        fileInputRef.current?.click();
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Upload Receipt</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleCameraClick}>
                                <ListItemIcon>
                                    <CameraAltIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Take Photo"
                                    secondary="Use your device camera"
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton onClick={handleFileClick}>
                                <ListItemIcon>
                                    <UploadFileIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Upload Image"
                                    secondary="Choose from your device"
                                />
                            </ListItemButton>
                        </ListItem>
                    </List>

                    {/* Hidden file inputs */}
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={onClose}
                        startIcon={<CloseIcon />}
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Upload Progress Snackbar */}
            {uploading && (
                <Snackbar
                    open={uploading}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert
                        severity="info"
                        icon={<CircularProgress size={20} />}
                    >
                        Uploading receipt...
                    </Alert>
                </Snackbar>
            )}

            {/* Success/Error Snackbar */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={snackbarSeverity === 'error' ? 8000 : 6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ReceiptUpload;
