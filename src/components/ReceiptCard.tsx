import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import StoreIcon from '@mui/icons-material/Store';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ReceiptIcon from '@mui/icons-material/Receipt';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import { Receipt } from '../types/receipt.types';

interface ReceiptCardProps {
    receipt: Receipt;
    onDelete?: (id: number) => void;
}

const ReceiptCard: React.FC<ReceiptCardProps> = ({ receipt, onDelete }) => {
    const [expanded, setExpanded] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        handleMenuClose();
        if (onDelete) {
            onDelete(receipt.id);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Card
            elevation={2}
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease',
                '&:hover': {
                    elevation: 6,
                    transform: 'translateY(-4px)'
                }
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Header Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <StoreIcon color="primary" />
                            <Typography
                                variant="h6"
                                component="div"
                                fontWeight="bold"
                            >
                                {receipt.store}
                            </Typography>
                        </Box>
                        {onDelete && (
                            <IconButton
                                size="small"
                                onClick={handleMenuClick}
                                aria-label="more options"
                            >
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <CalendarTodayIcon
                            fontSize="small"
                            color="action"
                        />
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {formatDate(receipt.date)}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Totals Section */}
                <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Subtotal:
                        </Typography>
                        <Typography variant="body2">{formatCurrency(receipt.subtotal)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Tax:
                        </Typography>
                        <Typography variant="body2">{formatCurrency(receipt.tax)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                        >
                            Total:
                        </Typography>
                        <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary"
                        >
                            {formatCurrency(receipt.total)}
                        </Typography>
                    </Box>
                </Box>

                {/* Items Section */}
                <Accordion
                    expanded={expanded}
                    onChange={() => setExpanded(!expanded)}
                    sx={{ mt: 2, boxShadow: 'none' }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            px: 0,
                            minHeight: 48,
                            '&.Mui-expanded': { minHeight: 48 }
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <ReceiptIcon
                                fontSize="small"
                                color="action"
                            />
                            <Typography
                                variant="body2"
                                fontWeight="medium"
                            >
                                {receipt.receiptItems.length} Items
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 0 }}>
                        <TableContainer
                            component={Paper}
                            variant="outlined"
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item</TableCell>
                                        <TableCell align="right">Qty</TableCell>
                                        <TableCell align="right">Unit Price</TableCell>
                                        <TableCell align="right">Total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {receipt.receiptItems.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.item.name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{formatCurrency(item.unitPrice)}</TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                >
                                                    {formatCurrency(item.lineTotal)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>

                {/* Footer with Receipt ID */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Chip
                        label={`ID: ${receipt.id}`}
                        size="small"
                        variant="outlined"
                    />
                </Box>
            </CardContent>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default ReceiptCard;
