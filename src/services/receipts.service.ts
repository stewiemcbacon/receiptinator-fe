import api from './api';
import { Receipt, ReceiptFilters } from '../types/receipt.types';

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
 * Fetch receipts with optional filters
 */
export const getReceipts = async (filters?: ReceiptFilters): Promise<Receipt[]> => {
    const params: Record<string, string> = {};

    if (filters?.store) {
        params.store = filters.store;
    }

    if (filters?.startDate && filters?.endDate) {
        params.startDate = filters.startDate;
        params.endDate = filters.endDate;
    }

    const response = await api.get<Receipt[]>('/api/receipts', { params });
    return response.data;
};
