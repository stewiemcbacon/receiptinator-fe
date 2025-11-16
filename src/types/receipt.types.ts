export interface Item {
    id: number;
    name: string;
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
    tax: number;
    total: number;
    createdAt: string;
    receiptItems: ReceiptItem[];
}

export type SearchField = 'store' | 'item' | 'category' | 'storage';

export interface ReceiptFilters {
    searchQuery?: string; // Unified search for store name AND items
    month?: string; // Format: YYYY-MM
    fields?: SearchField[]; // Fields to search in: store, item, category, storage
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
