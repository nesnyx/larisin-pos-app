import { ENDPOINTS } from "@/constants/endpoints";
import api from "@/utils/api";
import { create } from "zustand";


export interface TransactionHistory {
    id: string;
    invoice: string;
    customerName: string;
    totalPrice: number;
    amount: number;
    createdAt: string;
    status: string;
}

interface CheckoutItem {
    productId: string;
    quantity: number;
}

interface TransactionStore {
    histories: TransactionHistory[];
    fetchHistories: (filter?: string) => Promise<void>;
    isLoading: boolean;
    totalTransactions: number;
    totalRevenuePerDay: number
    isSuccess: boolean;
    checkout: (
        items: CheckoutItem[], charge: number, customerName: string
    ) => Promise<any>;
    resetState: () => void;
    totalTransactionAndRevenue: () => void;
}

export const useTransactionStore = create<TransactionStore>((set) => ({
    isLoading: false,
    isSuccess: false,
    totalRevenuePerDay: 0,
    totalTransactions: 0,
    histories: [],

    fetchHistories: async (filter?: string) => {
        try {
            set({ isLoading: true });

            const response = await api.get(
                `${ENDPOINTS.TRANSACTIONS.LIST}`
            );

            set({ histories: response.data.data });
        } catch (error) {
            console.log("Fetch History Error:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    checkout: async (items, charge, customerName) => {
        try {
            set({ isLoading: true, isSuccess: false });

            const response = await api.post(
                ENDPOINTS.TRANSACTIONS.CHECKOUT,
                {
                    items,
                    charge,
                    customerName
                }
            );

            set({ isSuccess: true });

            return response.data;
        } catch (error) {
            console.log("Checkout Error:", error);
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    resetState: () => {
        set({ isSuccess: false });
    },
    totalTransactionAndRevenue: async () => {
        try {
            set({ isLoading: true });
            const response = await api.get(
                `${ENDPOINTS.TRANSACTIONS.TOTAL}`
            );
            set({ totalRevenuePerDay: response.data.data.totalRevenue,totalTransactions:response.data.data.totalTransactions });
        } catch (error) {
            console.log("Fetch History Error:", error);
        } finally {
            set({ isLoading: false });
        }
    }
}));
