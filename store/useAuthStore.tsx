import { ENDPOINTS } from "@/constants/endpoints";
import api from "@/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface UserProfile {
  userId: string;
  name: string;
  phone?: string;
  address?: string;
}

interface UpdateProfilePayload {
  name: string;
  phone: string;
  address: string;
}

interface UserState {
  profile: UserProfile | null;
  isLoggedIn: boolean;
  loading: boolean;
  setToken: (token: string) => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearProfile: () => Promise<void>;
  hydrateAuth: () => Promise<void>;
  updateProfile: (profile: UpdateProfilePayload) => Promise<void>;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoggedIn: false,
      loading: false,

      setToken: async (token: string) => {
        await AsyncStorage.setItem("userToken", token);
        set({ isLoggedIn: true });
      },

      fetchProfile: async () => {
        try {
          const response = await api.get(ENDPOINTS.AUTH.PROFILE);
          set({ profile: response.data.data, isLoggedIn: true });
        } catch (error) {
          await get().clearProfile();
        }
      },

      clearProfile: async () => {
        await AsyncStorage.removeItem("userToken");
        set({ profile: null, isLoggedIn: false });
        router.replace("/auth");
      },
      updateProfile: async (payload: UpdateProfilePayload) => {
        try {
          await api.patch(ENDPOINTS.USER.UPDATE_PROFILE, payload);
          await get().fetchProfile();
        } catch (error) {
          console.error("Failed to update profile", error);
        }
      },
      hydrateAuth: async () => {
        try {
          const token = await AsyncStorage.getItem("userToken");
          if (token) {
            await get().fetchProfile();
            if (get().isLoggedIn) {
              set({ loading: false });
              router.replace("/(tabs)");
            }
          } else {
            set({ isLoggedIn: false });
            router.replace("/auth");
          }
        } catch (error) {
          set({ isLoggedIn: false });
          router.replace("/auth");
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "user-auth-storage", // Kunci unik untuk AsyncStorage
      storage: createJSONStorage(() => AsyncStorage),
      // Kita hanya ingin mem-persist state ini saja
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        profile: state.profile,
      }),
    },
  ),
);

export default useUserStore;
