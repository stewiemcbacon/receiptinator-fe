import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    CircularProgress,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    Typography,
    InputAdornment,
    useMediaQuery,
    useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import { Receipt, ReceiptItem, formatCategoryLabel } from '../types/receipt.types';
import { updateReceipt, getReceiptCategories } from '../services/receipts.service';

interface ReceiptUpdateDialogProps {
    open: boolean;
    onClose: () => void;
    receipt: Receipt | null;
    onUpdateSuccess?: () => void;
}

interface EditableReceiptItem extends ReceiptItem {
    _deleted?: boolean;
}

const ReceiptUpdateDialog: React.FC<ReceiptUpdateDialogProps> = ({
    open,
    onClose,
    receipt,
    onUpdateSuccess
}) => {
    const [store, setStore] = useState('');
    const [date, setDate] = useState('');
    const [subtotal, setSubtotal] = useState('');
    const [tax, setTax] = useState('');
    const [discount, setDiscount] = useState('');
    const [total, setTotal] = useState('');
    const [category, setCategory] = useState('');
    const [receiptItems, setReceiptItems] = useState<EditableReceiptItem[]>([]);
    const [categories, setCategories] = useState<string[]>([]);

    const [updating, setUpdating] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Load categories on mount
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const cats = await getReceiptCategories();
                setCategories(cats);
            } catch (error) {
                console.error('Failed to load categories:', error);
            }
        };
        loadCategories();
    }, []);

    // Populate form when receipt changes
    useEffect(() => {
        if (receipt) {
            setStore(receipt.store || '');
            setDate(receipt.date || '');
            setSubtotal(receipt.subtotal?.toString() || '0');
            setTax(receipt.tax?.toString() || '0');
            setDiscount(receipt.discount?.toString() || '0');
            setTotal(receipt.total?.toString() || '0');
            setCategory(receipt.category || '');
            setReceiptItems(receipt.receiptItems ? [...receipt.receiptItems] : []);
        } else {
            // Reset form when receipt is null
            setStore('');
            setDate('');
            setSubtotal('0');
            setTax('0');
            setDiscount('0');
            setTotal('0');
            setCategory('');
            setReceiptItems([]);
        }
    }, [receipt]);

    const handleClose = () => {
        if (!updating) {
            onClose();
        }
    };

    const handleItemQuantityChange = (index: number, value: string) => {
        const newItems = [...receiptItems];
        const quantity = parseFloat(value) || 0;
        newItems[index].quantity = quantity;
        newItems[index].lineTotal = quantity * newItems[index].unitPrice;
        setReceiptItems(newItems);
    };

    const handleItemPriceChange = (index: number, value: string) => {
        const newItems = [...receiptItems];
        const price = parseFloat(value) || 0;
        newItems[index].unitPrice = price;
        newItems[index].lineTotal = newItems[index].quantity * price;
        setReceiptItems(newItems);
    };

    const handleItemNameChange = (index: number, value: string) => {
        const newItems = [...receiptItems];
        newItems[index].item.name = value;
        setReceiptItems(newItems);
    };

    const handleDeleteItem = (index: number) => {
        const newItems = [...receiptItems];
        // Mark for deletion (will be removed by not including in the update request)
        newItems.splice(index, 1);
        setReceiptItems(newItems);
    };

    const handleAddItem = () => {
        const newItem: EditableReceiptItem = {
            id: 0, // 0 indicates a new item (no id means it will be created)
            item: {
                id: 0,
                name: '',
                normalizedName: '',
                category: 'OTHER',
                storage: 'PANTRY',
                createdAt: new Date().toISOString()
            },
            quantity: 1,
            unitPrice: 0,
            lineTotal: 0,
            createdAt: new Date().toISOString()
        };
        setReceiptItems([...receiptItems, newItem]);
    };

    const validateForm = (): string | null => {
        if (!store.trim()) return 'Store name is required';
        if (!date) return 'Date is required';
        if (parseFloat(subtotal) < 0) return 'Subtotal cannot be negative';
        if (parseFloat(tax) < 0) return 'Tax cannot be negative';
        if (parseFloat(discount) < 0) return 'Discount cannot be negative';
        if (parseFloat(total) < 0) return 'Total cannot be negative';

        // Validate items
        for (const item of receiptItems) {
            if (!item.item.name.trim()) return 'All items must have a name';
            if (item.quantity <= 0) return 'All items must have a positive quantity';
            if (item.unitPrice < 0) return 'Item prices cannot be negative';
        }

        return null;
    };

    const handleSubmit = async () => {
        const validationError = validateForm();
        if (validationError) {
            showSnackbar(validationError, 'error');
            return;
        }

        if (!receipt) return;

        setUpdating(true);

        try {
            // Prepare the update data
            const updateData: Partial<Receipt> = {
                store: store.trim(),
                date,
                subtotal: parseFloat(subtotal),
                tax: parseFloat(tax),
                discount: parseFloat(discount),
                total: parseFloat(total),
                category: category || null,
                receiptItems: receiptItems.map(item => {
                    // For existing items, include the id
                    // For new items (id === 0), don't include id (backend will create)
                    const receiptItemData: any = {
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        lineTotal: item.lineTotal
                    };

                    // Include id for existing items
                    if (item.id > 0) {
                        receiptItemData.id = item.id;
                    }

                    // Handle item reference
                    if (item.item.id > 0) {
                        // Existing item reference
                        receiptItemData.item = { id: item.item.id };
                    } else {
                        // New item - send full item data
                        receiptItemData.item = {
                            name: item.item.name,
                            category: item.item.category,
                            storage: item.item.storage
                        };
                    }

                    return receiptItemData;
                })
            };

            await updateReceipt(receipt.id, updateData);
            onClose();
            showSnackbar('Receipt updated successfully!', 'success');
            onUpdateSuccess?.();
        } catch (error: any) {
            console.error('Update error:', error);
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update receipt';
            showSnackbar(errorMessage, 'error');
        } finally {
            setUpdating(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
                fullScreen={isMobile}
            >
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Edit Receipt
                    <IconButton
                        edge="end"
                        onClick={handleClose}
                        disabled={updating}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pb: { xs: '120px', sm: 2 } }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        {/* Basic Receipt Information */}
                        <TextField
                            label="Store"
                            value={store}
                            onChange={(e) => setStore(e.target.value)}
                            fullWidth
                            required
                            disabled={updating}
                        />

                        <TextField
                            label="Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            fullWidth
                            required
                            disabled={updating}
                            InputLabelProps={{ shrink: true }}
                        />

                        <FormControl fullWidth disabled={updating}>
                            <InputLabel>Category</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                label="Category"
                            >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {categories.map((cat) => (
                                    <MenuItem key={cat} value={cat}>
                                        {formatCategoryLabel(cat)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Financial Fields */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                            <TextField
                                label="Subtotal"
                                type="number"
                                value={subtotal}
                                onChange={(e) => setSubtotal(e.target.value)}
                                fullWidth
                                required
                                disabled={updating}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />

                            <TextField
                                label="Tax"
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                fullWidth
                                required
                                disabled={updating}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />

                            <TextField
                                label="Discount"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                fullWidth
                                required
                                disabled={updating}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />

                            <TextField
                                label="Total"
                                type="number"
                                value={total}
                                onChange={(e) => setTotal(e.target.value)}
                                fullWidth
                                required
                                disabled={updating}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>
                                }}
                            />
                        </Box>

                        {/* Receipt Items Section */}
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1, flexWrap: 'wrap', gap: 1 }}>
                                <Typography variant="h6">Items</Typography>
                                <Button
                                    startIcon={!isMobile && <AddIcon />}
                                    onClick={handleAddItem}
                                    disabled={updating}
                                    size="small"
                                    variant="outlined"
                                >
                                    {isMobile ? <AddIcon /> : 'Add Item'}
                                </Button>
                            </Box>

                            <TableContainer component={Paper} variant="outlined" sx={{ maxWidth: '100%', overflowX: 'auto' }}>
                                <Table size="small" sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Item Name</TableCell>
                                            <TableCell align="right">Quantity</TableCell>
                                            <TableCell align="right">Unit Price</TableCell>
                                            <TableCell align="right">Line Total</TableCell>
                                            <TableCell align="center">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {receiptItems.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center">
                                                    <Typography variant="body2" color="text.secondary">
                                                        No items. Click "Add Item" to add one.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            receiptItems.map((item, index) => (
                                                <TableRow key={item.id || `new-${index}`}>
                                                    <TableCell>
                                                        <TextField
                                                            value={item.item.name}
                                                            onChange={(e) => handleItemNameChange(index, e.target.value)}
                                                            size="small"
                                                            fullWidth
                                                            disabled={updating}
                                                            placeholder="Item name"
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            type="number"
                                                            value={item.quantity}
                                                            onChange={(e) => handleItemQuantityChange(index, e.target.value)}
                                                            size="small"
                                                            disabled={updating}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                            sx={{ width: { xs: 60, sm: 80 } }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        <TextField
                                                            type="number"
                                                            value={item.unitPrice}
                                                            onChange={(e) => handleItemPriceChange(index, e.target.value)}
                                                            size="small"
                                                            disabled={updating}
                                                            inputProps={{ min: 0, step: 0.01 }}
                                                            InputProps={{
                                                                startAdornment: <InputAdornment position="start">$</InputAdornment>
                                                            }}
                                                            sx={{ width: 100 }}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="right">
                                                        ${item.lineTotal.toFixed(2)}
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => handleDeleteItem(index)}
                                                            disabled={updating}
                                                            color="error"
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{
                    p: { xs: '16px 16px 32px 16px', sm: 2 },
                    position: { xs: 'sticky', sm: 'relative' },
                    bottom: 0,
                    backgroundColor: 'background.paper',
                    borderTop: { xs: 1, sm: 0 },
                    borderColor: { xs: 'divider', sm: 'transparent' },
                    zIndex: 1
                }}>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={updating}
                        startIcon={updating ? <CircularProgress size={20} /> : <SaveIcon />}
                        fullWidth
                        size={isMobile ? 'large' : 'medium'}
                    >
                        {updating ? 'Updating...' : 'Update'}
                    </Button>
                </DialogActions>
            </Dialog>

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

export default ReceiptUpdateDialog;
