import { useCheckInternet } from '@/hooks/useCheckInternet'; // Import hook
import useAuthStore from '@/store/useAuthStore';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { WifiOff } from 'lucide-react-native';
import { useEffect } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import "../global.css";

SplashScreen.preventAutoHideAsync();


function OfflineBanner() {
  const isOnline = useCheckInternet();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-red-500 w-full absolute top-0 z-[999] flex-row items-center justify-center py-2 px-4 shadow-md"
    >
      <WifiOff size={14} />
      <Text className="text-white text-[11px] font-bold ml-2">
        Koneksi Terputus. Memeriksa jaringan...
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const loading = useAuthStore((state) => state.loading);
 
  useEffect(() => {
    async function prepare() {
      try {
        await hydrateAuth();
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);
  if (loading) {
    return <CustomLoadingScreen/>
  }
  return (
    <GestureHandlerRootView >
      <SafeAreaProvider>
        <OfflineBanner />
        <Stack>
          <Stack.Protected guard={!isLoggedIn}>
            <Stack.Screen name="auth" options={{ headerShown: false }} />
          </Stack.Protected>
          <Stack.Protected guard={isLoggedIn}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="product-detail" options={{ headerShown: false, presentation: 'transparentModal' }} />
            <Stack.Screen name="product-create" options={{ headerShown: false, presentation: 'transparentModal' }} />
            <Stack.Screen name="history-transaction-detail" options={{ headerShown: false, presentation: 'transparentModal' }} />
          </Stack.Protected>
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function CustomLoadingScreen() {
  return (
    <View className="flex-1 bg-white items-center justify-center">
      {/* Kamu bisa ganti ini dengan Logo Aplikasi kamu */}
      <View className="mb-8 items-center">
        <View className="w-20 h-20 bg-blue-600 rounded-3xl items-center justify-center shadow-lg shadow-blue-300">
          <Text className="text-white text-4xl font-bold">A</Text>
        </View>
        <Text className="text-xl font-bold mt-4 text-slate-800">NamaAplikasi</Text>
        <Text className="text-slate-400 text-sm">Menyiapkan data anda...</Text>
      </View>

      {/* Loading Indicator yang lebih modern */}
      <ActivityIndicator size="large" color="#2563eb" />

      <View className="absolute bottom-10">
        <Text className="text-slate-300 text-xs tracking-widest uppercase">Version 1.0.0</Text>
      </View>
    </View>
  );
}