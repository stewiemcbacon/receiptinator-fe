import React from 'react';
import { Box, TextField, Button, Paper, Grid2 as Grid, Typography } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { ReceiptFilters as Filters } from '../types/receipt.types';

interface ReceiptFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    onApplyFilters: () => void;
    onClearFilters: () => void;
}

const ReceiptFilters: React.FC<ReceiptFiltersProps> = ({
    filters,
    onFiltersChange,
    onApplyFilters,
    onClearFilters
}) => {
    const handleStoreChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, store: event.target.value });
    };

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, startDate: event.target.value });
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onFiltersChange({ ...filters, endDate: event.target.value });
    };

    const handleKeyPress = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            onApplyFilters();
        }
    };

    const isFiltersActive = filters.store || filters.startDate || filters.endDate;

    return (
        <Paper
            elevation={2}
            sx={{ p: 3, mb: 3 }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <FilterListIcon color="primary" />
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Filter Receipts
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >
                {/* Store Filter */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        label="Store Name"
                        placeholder="Enter store name"
                        value={filters.store || ''}
                        onChange={handleStoreChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                    />
                </Grid>

                {/* Start Date Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        label="Start Date"
                        type="date"
                        value={filters.startDate || ''}
                        onChange={handleStartDateChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>

                {/* End Date Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <TextField
                        fullWidth
                        label="End Date"
                        type="date"
                        value={filters.endDate || ''}
                        onChange={handleEndDateChange}
                        onKeyPress={handleKeyPress}
                        variant="outlined"
                        size="small"
                        InputLabelProps={{
                            shrink: true
                        }}
                    />
                </Grid>

                {/* Action Buttons */}
                <Grid size={{ xs: 12, md: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, height: '100%' }}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={onApplyFilters}
                            startIcon={<SearchIcon />}
                            sx={{ minHeight: 40 }}
                        >
                            Apply
                        </Button>
                        {isFiltersActive && (
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={onClearFilters}
                                startIcon={<ClearIcon />}
                                sx={{ minHeight: 40 }}
                            >
                                Clear
                            </Button>
                        )}
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReceiptFilters;
