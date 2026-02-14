import { ENDPOINTS } from "@/constants/endpoints";
import api from "@/utils/api";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface UserProfile {
    userId: string;
    name: string;
    phone?: string;
}

interface UserState {
    profile: UserProfile | null;
    isLoggedIn: boolean;
    loading: boolean;
    setIsLoggedIn: (status: boolean) => void;
    setToken: (token: string) => Promise<void>;
    fetchProfile: () => Promise<void>;
    clearProfile: () => void;
    hydrateAuth: () => void
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: null,
    isLoggedIn: false,
    loading: false,
    setToken: async (token: string) => {
        await SecureStore.setItemAsync("userToken", token);
        set({ isLoggedIn: true });
    },

    fetchProfile: async () => {
        try {
            const response = await api.get(ENDPOINTS.AUTH.PROFILE);
            set({ profile: response.data.data, isLoggedIn: true });
        } catch (error) {
            await SecureStore.deleteItemAsync("userToken");
            set({ isLoggedIn: false });
        }
    },
    setIsLoggedIn: (status: boolean) => set({ isLoggedIn: status }),
    clearProfile: () => set({ profile: null, isLoggedIn: false }),
    hydrateAuth: async () => {
        set({ loading: true });
        try {
            const token = await SecureStore.getItemAsync("userToken");
            if (token) {
                // Opsional: Validasi token ke API di sini
                set({ isLoggedIn: true });
                await get().fetchProfile();
            } else {
                set({ isLoggedIn: false });
            }
        } catch (error) {
            set({ isLoggedIn: false });
            await SecureStore.deleteItemAsync("userToken"); // Hapus jika corrupt
        } finally {
            set({ loading: false });
        }
    }
}));


export default useUserStore