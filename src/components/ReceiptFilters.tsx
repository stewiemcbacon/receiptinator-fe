import React, { useEffect, useState } from 'react';
import { Box, TextField, Paper, Grid2 as Grid, Typography, MenuItem, IconButton, InputAdornment, Chip } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import CategoryIcon from '@mui/icons-material/Category';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { ReceiptFilters as Filters, AvailableMonth, SearchField, ReceiptCategory, ReceiptCategoryLabels } from '../types/receipt.types';

interface ReceiptFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    availableMonths: AvailableMonth[];
}

const ReceiptFilters: React.FC<ReceiptFiltersProps> = ({ filters, onFiltersChange, availableMonths }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery || '');
    const [localFields, setLocalFields] = useState<SearchField[] | undefined>(filters.fields);

    // Debounce search query changes
    useEffect(() => {
        // Only update if the search query actually changed from what's in filters
        if (localSearchQuery === filters.searchQuery) {
            return;
        }

        const timeoutId = setTimeout(() => {
            // Include local fields in the update, but only if search query is not empty
            const updatedFilters = {
                ...filters,
                searchQuery: localSearchQuery,
                fields: localSearchQuery.trim() ? localFields : undefined
            };
            onFiltersChange(updatedFilters);
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

    const handleCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onFiltersChange({ ...filters, category: value ? (value as ReceiptCategory) : undefined });
    };

    const handleClearSearch = () => {
        setLocalSearchQuery('');
    };

    const handleFieldToggle = (field: SearchField) => {
        const currentFields = localFields || [];
        const isActive = currentFields.includes(field);

        let newFields: SearchField[];
        if (isActive) {
            // Remove the field
            newFields = currentFields.filter(f => f !== field);
        } else {
            // Add the field
            newFields = [...currentFields, field];
        }

        const updatedFields = newFields.length > 0 ? newFields : undefined;
        setLocalFields(updatedFields);

        // Only trigger a fetch if there's a search query
        if (localSearchQuery.trim()) {
            onFiltersChange({ ...filters, fields: updatedFields });
        }
    };

    const isFieldActive = (field: SearchField): boolean => {
        return localFields?.includes(field) || false;
    };

    const fieldConfigs: Array<{ field: SearchField; label: string; icon: React.ReactElement; description: string }> = [
        {
            field: 'store',
            label: 'Store',
            icon: <StorefrontIcon fontSize="small" />,
            description: 'Search store names'
        },
        {
            field: 'item',
            label: 'Item',
            icon: <LocalOfferIcon fontSize="small" />,
            description: 'Search product names'
        },
        {
            field: 'category',
            label: 'Category',
            icon: <CategoryIcon fontSize="small" />,
            description: 'Search item categories'
        },
        {
            field: 'storage',
            label: 'Storage',
            icon: <KitchenIcon fontSize="small" />,
            description: 'Search storage locations'
        }
    ];

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
                <Grid size={{ xs: 12, md: 6 }}>
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
                <Grid size={{ xs: 12, md: 3 }}>
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
                            <MenuItem
                                key={month.month}
                                value={month.month}
                            >
                                {month.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Category Filter */}
                <Grid size={{ xs: 12, md: 3 }}>
                    <TextField
                        fullWidth
                        select
                        label="Category"
                        value={filters.category || ''}
                        onChange={handleCategoryChange}
                        variant="outlined"
                        size="small"
                    >
                        <MenuItem value="">
                            <em>All Categories</em>
                        </MenuItem>
                        {Object.entries(ReceiptCategory).map(([key, value]) => (
                            <MenuItem
                                key={value}
                                value={value}
                            >
                                {ReceiptCategoryLabels[value]}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>

                {/* Field Filter Chips */}
                <Grid size={{ xs: 12 }}>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 1.5, fontWeight: 500 }}
                        >
                            Search in: {!filters.fields || filters.fields.length === 0 ? '(All fields)' : ''}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {fieldConfigs.map(({ field, label, icon, description }) => (
                                <Chip
                                    key={field}
                                    label={label}
                                    icon={icon}
                                    onClick={() => handleFieldToggle(field)}
                                    color={isFieldActive(field) ? 'primary' : 'default'}
                                    variant={isFieldActive(field) ? 'filled' : 'outlined'}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 1
                                        }
                                    }}
                                    aria-label={description}
                                    aria-pressed={isFieldActive(field)}
                                />
                            ))}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReceiptFilters;
