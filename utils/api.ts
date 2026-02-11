import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const BASE_URL =
  Platform.OS === "android"
    ? "http://192.168.1.3:3002" // Ganti dengan IP lokal laptopmu jika pakai emulator/HP asli
    : "http://localhost:3002";

const api = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper untuk handle storage beda platform
const getStorageItem = async (key:any) => {
  if (Platform.OS === "web") {
    return localStorage.getItem(key);
  }
  return await SecureStore.getItemAsync(key);
};

const deleteStorageItem = async (key:any) => {
  if (Platform.OS === "web") {
    localStorage.removeItem(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

api.interceptors.request.use(
  async (config) => {
    const token = await getStorageItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired or invalid, logging out...");
      await deleteStorageItem("userToken");
    }
    return Promise.reject(error);
  }
);

export default api;