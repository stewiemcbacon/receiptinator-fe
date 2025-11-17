export interface Item {
    id: number;
    name: string;
    normalizedName: string;
    category: string;
    storage: string;
    createdAt: string;
}

export interface ReceiptItem {
    id: number;
    item: Item;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
    createdAt: string;
}

export interface Receipt {
    id: number;
    store: string;
    date: string;
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
    category: string | null;
    createdAt: string;
    receiptItems: ReceiptItem[];
}

export type SearchField = 'store' | 'item';

// Helper function to format category labels from backend enum values
export const formatCategoryLabel = (category: string): string => {
    return category
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export interface ReceiptFilters {
    searchQuery?: string; // Unified search for store name AND items
    month?: string; // Format: YYYY-MM
    category?: string; // Receipt category filter
    itemCategory?: string; // Item category filter
    storage?: string; // Item storage filter
    fields?: SearchField[]; // Fields to search in: store, item
}

export interface MonthlyTotal {
    month: string; // Format: YYYY-MM
    totalSpent: number;
    receiptCount: number;
}

export interface PagedReceiptsResponse {
    receipts: Receipt[];
    monthlyTotals: MonthlyTotal[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
}

export interface AvailableMonth {
    month: string; // Format: YYYY-MM
    label: string; // Format: e.g., "January 2025"
}
