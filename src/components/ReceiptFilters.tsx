import React, { useEffect, useState } from 'react';
import { Box, TextField, Paper, Grid2 as Grid, Typography, MenuItem, IconButton, InputAdornment } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { ReceiptFilters as Filters, AvailableMonth } from '../types/receipt.types';

interface ReceiptFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    availableMonths: AvailableMonth[];
}

const ReceiptFilters: React.FC<ReceiptFiltersProps> = ({
    filters,
    onFiltersChange,
    availableMonths
}) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery || '');

    // Debounce search query changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onFiltersChange({ ...filters, searchQuery: localSearchQuery || undefined });
        }, 500); // 500ms debounce delay

        return () => clearTimeout(timeoutId);
    }, [localSearchQuery]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocalSearchQuery(event.target.value);
    };

    const handleMonthChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onFiltersChange({ ...filters, month: value || undefined });
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
    };

    const isFiltersActive = localSearchQuery || filters.month;

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
                    Search & Filter
                </Typography>
            </Box>

            <Grid
                container
                spacing={2}
            >
                {/* Search Input */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <TextField
                        fullWidth
                        label="Search"
                        placeholder="Search by store name or item..."
                        value={localSearchQuery}
                        onChange={handleSearchChange}
                        variant="outlined"
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                                endAdornment: localSearchQuery && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            size="small"
                                            onClick={handleClearSearch}
                                            edge="end"
                                        >
                                            <ClearIcon />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Grid>

                {/* Month Filter */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                        fullWidth
                        select
                        label="Month"
                        value={filters.month || ''}
                        onChange={handleMonthChange}
                        variant="outlined"
                        size="small"
                    >
                        <MenuItem value="">
                            <em>All Months</em>
                        </MenuItem>
                        {availableMonths.map((month) => (
                            <MenuItem key={month.month} value={month.month}>
                                {month.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReceiptFilters;
