import React, { useEffect, useState } from 'react';
import { Box, TextField, Paper, Grid2 as Grid, Typography, MenuItem, IconButton, InputAdornment, Chip, Button, Collapse } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ReceiptFilters as Filters, AvailableMonth, SearchField, formatCategoryLabel } from '../types/receipt.types';
import { getReceiptCategories, getItemCategories, getStorageTypes } from '../services/receipts.service';

interface ReceiptFiltersProps {
    filters: Filters;
    onFiltersChange: (filters: Filters) => void;
    availableMonths: AvailableMonth[];
}

const ReceiptFilters: React.FC<ReceiptFiltersProps> = ({ filters, onFiltersChange, availableMonths }) => {
    const [localSearchQuery, setLocalSearchQuery] = useState(filters.searchQuery || '');
    const [localFields, setLocalFields] = useState<SearchField[] | undefined>(filters.fields);
    const [receiptCategories, setReceiptCategories] = useState<string[]>([]);
    const [itemCategories, setItemCategories] = useState<string[]>([]);
    const [storageTypes, setStorageTypes] = useState<string[]>([]);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const [receipts, items, storage] = await Promise.all([
                    getReceiptCategories(),
                    getItemCategories(),
                    getStorageTypes()
                ]);
                setReceiptCategories(receipts);
                setItemCategories(items);
                setStorageTypes(storage);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        void fetchCategories();
    }, []);

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
        onFiltersChange({ ...filters, category: value || undefined });
    };

    const handleItemCategoryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onFiltersChange({ ...filters, itemCategory: value || undefined });
    };

    const handleStorageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        onFiltersChange({ ...filters, storage: value || undefined });
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
                <Grid size={{ xs: 12, md: 12 }}>
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

                {/* Advanced Filters Toggle */}
                <Grid size={{ xs: 12 }}>
                    <Button
                        endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        size="small"
                        sx={{
                            textTransform: 'none'
                        }}
                    >
                        {showAdvanced ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
                    </Button>

                    {/* Advanced Filters */}
                    <Collapse in={showAdvanced}>
                        <Grid
                            container
                            spacing={2}
                            sx={{ mt: 2 }}
                        >

                            {/* Month Filter */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
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

                            {/* Receipt Category Filter */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Receipt Category"
                                    value={filters.category || ''}
                                    onChange={handleCategoryChange}
                                    variant="outlined"
                                    size="small"
                                >
                                    <MenuItem value="">
                                        <em>All Categories</em>
                                    </MenuItem>
                                    {receiptCategories.map((category) => (
                                        <MenuItem
                                            key={category}
                                            value={category}
                                        >
                                            {formatCategoryLabel(category)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Item Category Filter */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Item Category"
                                    value={filters.itemCategory || ''}
                                    onChange={handleItemCategoryChange}
                                    variant="outlined"
                                    size="small"
                                >
                                    <MenuItem value="">
                                        <em>All Item Categories</em>
                                    </MenuItem>
                                    {itemCategories.map((category) => (
                                        <MenuItem
                                            key={category}
                                            value={category}
                                        >
                                            {formatCategoryLabel(category)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/* Storage Filter */}
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Storage"
                                    value={filters.storage || ''}
                                    onChange={handleStorageChange}
                                    variant="outlined"
                                    size="small"
                                >
                                    <MenuItem value="">
                                        <em>All Storage Locations</em>
                                    </MenuItem>
                                    {storageTypes.map((storage) => (
                                        <MenuItem
                                            key={storage}
                                            value={storage}
                                        >
                                            {formatCategoryLabel(storage)}
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
                    </Collapse>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default ReceiptFilters;
