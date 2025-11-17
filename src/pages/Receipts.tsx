import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid2 as Grid,
    Alert,
    Skeleton,
    Paper,
    CircularProgress,
    Snackbar,
    FormControlLabel,
    Switch
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import InfoIcon from '@mui/icons-material/Info';
import ReceiptCard from '../components/ReceiptCard';
import ReceiptFilters from '../components/ReceiptFilters';
import MonthHeader from '../components/MonthHeader';
import { getReceipts, getAvailableMonths, deleteReceipt } from '../services/receipts.service';
import { Receipt, ReceiptFilters as Filters, MonthlyTotal, AvailableMonth } from '../types/receipt.types';

const Receipts: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingMore, setLoadingMore] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({ searchQuery: '' });
    const [showMetadata, setShowMetadata] = useState<boolean>(true);
    const [page, setPage] = useState<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [monthlyTotals, setMonthlyTotals] = useState<MonthlyTotal[]>([]);
    const [totalElements, setTotalElements] = useState<number>(0);
    const [availableMonths, setAvailableMonths] = useState<AvailableMonth[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const fetchReceipts = async (appliedFilters?: Filters, resetData: boolean = true) => {
        try {
            if (resetData) {
                setLoading(true);
                setPage(0);
                setReceipts([]);
            } else {
                setLoadingMore(true);
            }
            setError(null);

            const currentPage = resetData ? 0 : page;
            const response = await getReceipts(appliedFilters, currentPage, 20);

            if (resetData) {
                setReceipts(response.receipts);
                setMonthlyTotals(response.monthlyTotals);
            } else {
                setReceipts((prev) => [...prev, ...response.receipts]);
                // Merge monthly totals, updating existing ones and adding new ones
                setMonthlyTotals((prev) => {
                    const merged = [...prev];
                    response.monthlyTotals.forEach((newTotal) => {
                        const existingIndex = merged.findIndex((t) => t.month === newTotal.month);
                        if (existingIndex >= 0) {
                            merged[existingIndex] = newTotal;
                        } else {
                            merged.push(newTotal);
                        }
                    });
                    return merged;
                });
            }

            setTotalElements(response.totalElements);
            setHasMore(response.hasNext);
            if (!resetData) {
                setPage(currentPage + 1);
            } else {
                setPage(1);
            }
        } catch (err) {
            setError('Failed to load receipts. Please try again later.');
            console.error('Error fetching receipts:', err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const fetchAvailableMonths = async () => {
        try {
            const months = await getAvailableMonths();
            setAvailableMonths(months);
        } catch (err) {
            console.error('Error fetching available months:', err);
        }
    };

    const loadMore = useCallback(() => {
        if (!loadingMore && hasMore && !loading) {
            void fetchReceipts(filters, false);
        }
    }, [loadingMore, hasMore, loading, filters, page]);

    // Fetch available months only once on mount
    useEffect(() => {
        void fetchAvailableMonths();
    }, []);

    // Fetch receipts when filters change (including initial mount)
    useEffect(() => {
        void fetchReceipts(filters);
    }, [filters]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '100px',
            threshold: 0.1
        };

        observerRef.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, options);

        if (loadMoreRef.current) {
            observerRef.current.observe(loadMoreRef.current);
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadMore]);

    // Group receipts by month for Card view
    const groupReceiptsByMonth = (receipts: Receipt[]): Map<string, Receipt[]> => {
        const grouped = new Map<string, Receipt[]>();

        receipts.forEach((receipt) => {
            const date = new Date(receipt.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            if (!grouped.has(monthKey)) {
                grouped.set(monthKey, []);
            }
            grouped.get(monthKey)!.push(receipt);
        });

        return grouped;
    };

    const handleDeleteReceipt = async (id: number) => {
        // Find the receipt before deleting to get its data for updating totals
        const receiptToDelete = receipts.find((r) => r.id === id);
        if (!receiptToDelete) return;

        try {
            await deleteReceipt(id);

            // Calculate the month key for the deleted receipt
            const date = new Date(receiptToDelete.date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

            // Remove receipt from local state
            setReceipts((prev) => prev.filter((receipt) => receipt.id !== id));

            // Update monthly totals
            setMonthlyTotals((prev) =>
                prev
                    .map((monthTotal) => {
                        if (monthTotal.month === monthKey) {
                            return {
                                ...monthTotal,
                                totalSpent: monthTotal.totalSpent - receiptToDelete.total,
                                receiptCount: monthTotal.receiptCount - 1
                            };
                        }
                        return monthTotal;
                    })
                    .filter((monthTotal) => monthTotal.receiptCount > 0)
            );

            // Update total elements count
            setTotalElements((prev) => prev - 1);

            // Show success message
            setSnackbarMessage('Receipt deleted successfully');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        } catch (err) {
            console.error('Error deleting receipt:', err);
            setSnackbarMessage('Failed to delete receipt. Please try again.');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
        }
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
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
                availableMonths={availableMonths}
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
                        {filters.searchQuery || filters.month
                            ? 'Try adjusting your search or filters to see more results.'
                            : 'Your receipts will appear here once they are added.'}
                    </Typography>
                </Paper>
            )}

            {/* Receipts Display */}
            {!loading && !error && receipts.length > 0 && (
                <>
                    <Box
                        sx={{
                            mb: 2,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: 2
                        }}
                    >
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Showing {receipts.length} of {totalElements} receipt{totalElements !== 1 ? 's' : ''}
                        </Typography>
                        <FormControlLabel
                            control={
                                <Switch
                                    checked={showMetadata}
                                    onChange={(e) => setShowMetadata(e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <InfoIcon fontSize="small" />
                                    <Typography variant="body2">Show details</Typography>
                                </Box>
                            }
                        />
                    </Box>

                    <Box>
                        {Array.from(groupReceiptsByMonth(receipts)).map(([monthKey, monthReceipts]) => {
                            const monthTotal = monthlyTotals.find((t) => t.month === monthKey);
                            return (
                                <Box key={monthKey}>
                                    <MonthHeader
                                        month={monthKey}
                                        totalSpent={monthTotal?.totalSpent || 0}
                                        receiptCount={monthTotal?.receiptCount || 0}
                                    />
                                    <Grid
                                        container
                                        spacing={3}
                                        sx={{ mb: 4 }}
                                    >
                                        {monthReceipts.map((receipt) => (
                                            <Grid
                                                key={receipt.id}
                                                size={{ xs: 12, sm: 6, md: 4 }}
                                            >
                                                <ReceiptCard
                                                    receipt={receipt}
                                                    onDelete={handleDeleteReceipt}
                                                    showMetadata={showMetadata}
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            );
                        })}
                        {/* Infinite scroll trigger */}
                        {hasMore && (
                            <Box
                                ref={loadMoreRef}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    py: 4
                                }}
                            >
                                {loadingMore && <CircularProgress />}
                            </Box>
                        )}
                    </Box>
                </>
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
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
        </Container>
    );
};

export default Receipts;
