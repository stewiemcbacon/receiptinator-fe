import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid2 as Grid,
    Alert,
    Skeleton,
    Paper,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import TableRowsIcon from '@mui/icons-material/TableRows';
import ReceiptCard from '../components/ReceiptCard';
import ReceiptFilters from '../components/ReceiptFilters';
import ReceiptsTable from '../components/ReceiptsTable';
import { getReceipts } from '../services/receipts.service';
import { Receipt, ReceiptFilters as Filters } from '../types/receipt.types';

type ViewMode = 'cards' | 'table';

const Receipts: React.FC = () => {
    const [receipts, setReceipts] = useState<Receipt[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Filters>({});
    const [viewMode, setViewMode] = useState<ViewMode>('cards');

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
        void fetchReceipts();
    }, []);

    const handleApplyFilters = () => {
        void fetchReceipts(filters);
    };

    const handleClearFilters = () => {
        const emptyFilters: Filters = {};
        setFilters(emptyFilters);
        void fetchReceipts(emptyFilters);
    };

    const handleViewChange = (_event: React.MouseEvent<HTMLElement>, newView: ViewMode | null) => {
        if (newView !== null) {
            setViewMode(newView);
        }
    };

    const LoadingSkeleton = () =>
        viewMode === 'cards' ? (
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
        ) : (
            <Paper
                elevation={2}
                sx={{ p: 2 }}
            >
                <Skeleton
                    variant="rectangular"
                    height={400}
                />
            </Paper>
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
                            Showing {receipts.length} receipt{receipts.length !== 1 ? 's' : ''}
                        </Typography>
                        <ToggleButtonGroup
                            value={viewMode}
                            exclusive
                            onChange={handleViewChange}
                            aria-label="view mode"
                            size="small"
                        >
                            <ToggleButton
                                value="cards"
                                aria-label="card view"
                            >
                                <ViewModuleIcon sx={{ mr: 1 }} />
                                Cards
                            </ToggleButton>
                            <ToggleButton
                                value="table"
                                aria-label="table view"
                            >
                                <TableRowsIcon sx={{ mr: 1 }} />
                                Table
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </Box>

                    {viewMode === 'cards' ? (
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
                    ) : (
                        <ReceiptsTable receipts={receipts} />
                    )}
                </>
            )}
        </Container>
    );
};

export default Receipts;
