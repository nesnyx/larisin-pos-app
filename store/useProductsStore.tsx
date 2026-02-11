import { ENDPOINTS } from "@/constants/endpoints";
import api from "@/utils/api";
import { create } from "zustand";

interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    stock: number;
}

interface ProductStore {
    items: Product[];
    isLoading: boolean;
    fetchProduct: () => Promise<void>;
    addProduct: (
        name: string,
        price: number,
        category: string,
        stock: number
    ) => Promise<void>;
    deleteProduct: (id: string) => Promise<void>
    updateProduct: (id: string, price: number, name: string, category: string, stock: number) => Promise<void>

}

export const useProductsStore = create<ProductStore>((set, get) => ({
    items: [],
    isLoading: true,
    fetchProduct: async () => {
        if (get().items.length === 0) set({ isLoading: true });
        try {
            const response = await api.get(ENDPOINTS.PRODUCTS.LIST);
            const newData = response.data.data;
            if (JSON.stringify(newData) !== JSON.stringify(get().items)) {
                set({ items: newData });
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => set({ isLoading: false }), 800);
        }
    },
    addProduct: async (
        name: string,
        price: number,
        category: string,
        stock: number
    ) => {
        set({ isLoading: true });
        try {
            const response = await api.post(ENDPOINTS.PRODUCTS.CREATE, {
                name: name,
                price: price,
                category,
                stock
            });
            await response.data.data;
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => set({ isLoading: false }), 800);
        }
    },
    deleteProduct: async (id) => {
        set({ isLoading: true });
        try {
            await api.delete(`${ENDPOINTS.PRODUCTS.DELETE}/${id}`);
        } catch (error) {
            alert("Gagal menghapus produk");
        } finally {
            await get().fetchProduct()
            setTimeout(() => set({ isLoading: false }), 800);
        }
    },
    updateProduct: async (id: string, price: number, name: string, category: string, stock: number) => {
        set({ isLoading: true });
        try {
            await api.patch(`${ENDPOINTS.PRODUCTS.UPDATE}/${id}`, {
                name,
                price, category, stock
            });
        } catch (error) {
            console.log(error)
            alert("Gagal update produk");
        } finally {
            await get().fetchProduct()
            setTimeout(() => set({ isLoading: false }), 800);
        }
    }

}));
