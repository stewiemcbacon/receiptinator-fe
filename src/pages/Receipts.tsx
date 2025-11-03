import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Grid2 as Grid, Alert, Skeleton, Paper } from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ReceiptCard from '../components/ReceiptCard';
import ReceiptFilters from '../components/ReceiptFilters';
import { getReceipts } from '../services/receipts.service';
import { Receipt, ReceiptFilters as Filters } from '../types/receipt.types';

const Receipts: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({});

    const fetchReceipts = async (appliedFilters?: Filters) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getReceipts(appliedFilters);
            setReceipts(data);
        } catch (err) {
            setError('Failed to load receipts. Please try again later.');
            console.error('Error fetching receipts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleApplyFilters = () => {
        fetchReceipts(filters);
    };

    const handleClearFilters = () => {
        const emptyFilters: Filters = {};
        setFilters(emptyFilters);
        fetchReceipts(emptyFilters);
    };

    const LoadingSkeleton = () => (
        <Grid
            container
            spacing={3}
        >
            {[1, 2, 3, 4, 5, 6].map((item) => (
                <Grid
                    key={item}
                    size={{ xs: 12, sm: 6, md: 4 }}
                >
                    <Paper
                        elevation={2}
                        sx={{ p: 2 }}
                    >
                        <Skeleton
                            variant="text"
                            width="60%"
                            height={32}
                        />
                        <Skeleton
                            variant="text"
                            width="40%"
                            height={24}
                            sx={{ mt: 1 }}
                        />
                        <Skeleton
                            variant="rectangular"
                            height={100}
                            sx={{ mt: 2 }}
                        />
                        <Skeleton
                            variant="text"
                            width="30%"
                            height={24}
                            sx={{ mt: 2 }}
                        />
                    </Paper>
                </Grid>
            ))}
        </Grid>
    );

    return (
        <Container
            maxWidth="xl"
            sx={{ py: 4 }}
        >
            {/* Page Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <ReceiptLongIcon
                        sx={{ fontSize: 40 }}
                        color="primary"
                    />
                    <Typography
                        variant="h4"
                        component="h1"
                        fontWeight="bold"
                    >
                        Receipts
                    </Typography>
                </Box>
                <Typography
                    variant="body1"
                    color="text.secondary"
                >
                    View and manage all your receipts
                </Typography>
            </Box>

            {/* Filters */}
            <ReceiptFilters
                filters={filters}
                onFiltersChange={setFilters}
                onApplyFilters={handleApplyFilters}
                onClearFilters={handleClearFilters}
            />

            {/* Error State */}
            {error && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {error}
                </Alert>
            )}

            {/* Loading State */}
            {loading && <LoadingSkeleton />}

            {/* Empty State */}
            {!loading && !error && receipts.length === 0 && (
                <Paper
                    elevation={0}
                    sx={{
                        p: 6,
                        textAlign: 'center',
                        backgroundColor: 'action.hover'
                    }}
                >
                    <ReceiptLongIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        gutterBottom
                    >
                        No receipts found
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {filters.store || filters.startDate || filters.endDate
                            ? 'Try adjusting your filters to see more results.'
                            : 'Your receipts will appear here once they are added.'}
                    </Typography>
                </Paper>
            )}

            {/* Receipts Grid */}
            {!loading && !error && receipts.length > 0 && (
                <>
                    <Box sx={{ mb: 2 }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Showing {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
                        </Typography>
                    </Box>
                    <Grid
                        container
                        spacing={3}
                    >
                        {receipts.map((receipt) => (
                            <Grid
                                key={receipt.id}
                                size={{ xs: 12, sm: 6, md: 4 }}
                            >
                                <ReceiptCard receipt={receipt} />
                            </Grid>
                        ))}
                    </Grid>
                </>
            )}
        </Container>
    );
};

export default Receipts;
