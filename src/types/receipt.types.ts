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

export interface ReceiptFilters {
    store?: string;
    startDate?: string;
    endDate?: string;
}
