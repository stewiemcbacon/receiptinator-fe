import React from 'react';
import { Box, Typography } from '@mui/material';

interface MonthHeaderProps {
    month: string; // Format: YYYY-MM
    totalSpent: number;
    receiptCount: number;
}

const MonthHeader: React.FC<MonthHeaderProps> = ({ month, totalSpent, receiptCount }) => {
    const formatMonthYear = (monthString: string) => {
        const [year, monthNum] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(monthNum) - 1);
        return date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    return (
        <Box
            sx={{
                position: 'sticky',
                top: { xs: 64, sm: 64 },
                zIndex: 100,
                py: 2,
                px: 1,
                mb: 2,
                borderBottom: 2,
                borderColor: 'divider',
                backdropFilter: 'blur(10px)',
                backgroundColor: (theme) =>
                    theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 2
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 2, flexWrap: 'wrap' }}>
                <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                    color="primary"
                >
                    {formatMonthYear(month)}
                </Typography>
                <Typography
                    variant="h6"
                    color="text.secondary"
                    fontWeight="medium"
                >
                    Total: {formatCurrency(totalSpent)}
                </Typography>
            </Box>
            <Typography
                variant="body1"
                color="text.secondary"
                fontWeight="medium"
            >
                {receiptCount} receipt{receiptCount !== 1 ? 's' : ''}
            </Typography>
        </Box>
    );
};

export default MonthHeader;
