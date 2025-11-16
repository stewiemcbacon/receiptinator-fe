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

    if (filters?.fields && filters.fields.length > 0) {
        params.fields = filters.fields.join(',');
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

/**
 * Delete a receipt by ID
 * @param id - The receipt ID to delete
 * @returns Promise<void>
 */
export const deleteReceipt = async (id: number): Promise<void> => {
    await api.delete(`/api/receipts/${id}`);
};

/**
 * Upload a receipt image to the n8n workflow
 * @param file - The image file to upload
 * @returns Promise<void>
 */
export const uploadReceipt = async (file: File): Promise<void> => {
    const formData = new FormData();
    formData.append('file', file);

    // Get webhook URL from environment variable
    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
        throw new Error('N8N webhook URL not configured. Please set VITE_N8N_WEBHOOK_URL in your .env file.');
    }

    try {
        const response = await api.post(webhookUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        return response.data;
    } catch (error: any) {
        // Extract error message from n8n response
        if (error?.response?.data) {
            const errorData = error.response.data;

            // New format from our updated workflow: { success: false, error: "message" }
            if (errorData.success === false && errorData.error) {
                throw new Error(errorData.error);
            }

            // Format: Object with error property
            if (errorData.error) {
                throw new Error(errorData.error);
            }

            // Format: Object with message property
            if (errorData.message) {
                throw new Error(errorData.message);
            }

            // Format: Plain string
            if (typeof errorData === 'string') {
                throw new Error(errorData);
            }
        }

        // Re-throw the original error if we couldn't extract a message
        throw error;
    }
};
