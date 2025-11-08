import api from './api';
import { Receipt, ReceiptFilters, PagedReceiptsResponse, AvailableMonth } from '../types/receipt.types';

/**
 * Fetch all receipts from the API
 */
export const getAllReceipts = async (): Promise<Receipt[]> => {
    const response = await api.get<Receipt[]>('/api/receipts');
    return response.data;
};

/**
 * Fetch receipts filtered by store name
 */
export const getReceiptsByStore = async (store: string): Promise<Receipt[]> => {
    const response = await api.get<Receipt[]>('/api/receipts', {
        params: { store }
    });
    return response.data;
};

/**
 * Fetch receipts filtered by date range
 */
export const getReceiptsByDateRange = async (startDate: string, endDate: string): Promise<Receipt[]> => {
    const response = await api.get<Receipt[]>('/api/receipts', {
        params: { startDate, endDate }
    });
    return response.data;
};

/**
 * Fetch receipts with optional filters and pagination
 */
export const getReceipts = async (
    filters?: ReceiptFilters,
    page: number = 0,
    size: number = 20
): Promise<PagedReceiptsResponse> => {
    const params: Record<string, string | number> = {
        page,
        size
    };

    if (filters?.searchQuery) {
        params.search = filters.searchQuery;
    }

    if (filters?.month) {
        params.month = filters.month;
    }

    const response = await api.get<PagedReceiptsResponse>('/api/receipts', { params });
    return response.data;
};

/**
 * Fetch available months that have receipts
 */
export const getAvailableMonths = async (): Promise<AvailableMonth[]> => {
    const response = await api.get<AvailableMonth[]>('/api/receipts/available-months');
    return response.data;
};
