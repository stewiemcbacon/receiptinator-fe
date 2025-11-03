import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Collapse,
    Box,
    Typography,
    Chip,
    Table as InnerTable,
    TableBody as InnerTableBody,
    TableCell as InnerTableCell,
    TableHead as InnerTableHead,
    TableRow as InnerTableRow
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Receipt } from '../types/receipt.types';

interface ReceiptsTableProps {
    receipts: Receipt[];
}

interface RowProps {
    receipt: Receipt;
}

const Row: React.FC<RowProps> = ({ receipt }) => {
    const [open, setOpen] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
        <>
            <TableRow
                sx={{
                    '& > *': { borderBottom: 'unset' },
                    '&:hover': { backgroundColor: 'action.hover' },
                    cursor: 'pointer'
                }}
                onClick={() => setOpen(!open)}
            >
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell>
                    <Chip
                        label={receipt.id}
                        size="small"
                        variant="outlined"
                    />
                </TableCell>
                <TableCell>
                    <Typography
                        variant="body2"
                        fontWeight="medium"
                    >
                        {receipt.store}
                    </Typography>
                </TableCell>
                <TableCell>{formatDate(receipt.date)}</TableCell>
                <TableCell align="right">{formatCurrency(receipt.subtotal)}</TableCell>
                <TableCell align="right">{formatCurrency(receipt.tax)}</TableCell>
                <TableCell align="right">
                    <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="primary"
                    >
                        {formatCurrency(receipt.total)}
                    </Typography>
                </TableCell>
                <TableCell align="center">
                    <Chip
                        label={receipt.receiptItems.length}
                        size="small"
                        color="primary"
                        variant="outlined"
                    />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={8}
                >
                    <Collapse
                        in={open}
                        timeout="auto"
                        unmountOnExit
                    >
                        <Box sx={{ margin: 2 }}>
                            <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                            >
                                Receipt Items
                            </Typography>
                            <InnerTable
                                size="small"
                                aria-label="items"
                            >
                                <InnerTableHead>
                                    <InnerTableRow>
                                        <InnerTableCell>Item Name</InnerTableCell>
                                        <InnerTableCell align="right">Quantity</InnerTableCell>
                                        <InnerTableCell align="right">Unit Price</InnerTableCell>
                                        <InnerTableCell align="right">Line Total</InnerTableCell>
                                    </InnerTableRow>
                                </InnerTableHead>
                                <InnerTableBody>
                                    {receipt.receiptItems.map((item) => (
                                        <InnerTableRow key={item.id}>
                                            <InnerTableCell component="th" scope="row">
                                                {item.item.name}
                                            </InnerTableCell>
                                            <InnerTableCell align="right">{item.quantity}</InnerTableCell>
                                            <InnerTableCell align="right">
                                                {formatCurrency(item.unitPrice)}
                                            </InnerTableCell>
                                            <InnerTableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="medium"
                                                >
                                                    {formatCurrency(item.lineTotal)}
                                                </Typography>
                                            </InnerTableCell>
                                        </InnerTableRow>
                                    ))}
                                </InnerTableBody>
                            </InnerTable>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const ReceiptsTable: React.FC<ReceiptsTableProps> = ({ receipts }) => {
    return (
        <TableContainer
            component={Paper}
            elevation={2}
        >
            <Table
                aria-label="receipts table"
                sx={{ minWidth: 650 }}
            >
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'action.hover' }}>
                        <TableCell />
                        <TableCell>ID</TableCell>
                        <TableCell>Store</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell align="right">Subtotal</TableCell>
                        <TableCell align="right">Tax</TableCell>
                        <TableCell align="right">Total</TableCell>
                        <TableCell align="center">Items</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {receipts.map((receipt) => (
                        <Row
                            key={receipt.id}
                            receipt={receipt}
                        />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ReceiptsTable;
