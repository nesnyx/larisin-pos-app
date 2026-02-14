import { useCheckInternet } from '@/hooks/useCheckInternet'; // Import hook
import useAuthStore from '@/store/useAuthStore';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { WifiOff } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import "../global.css";

export const unstable_settings = {
  initialRouteName: 'auth',
};

function OfflineBanner() {
  const isOnline = useCheckInternet();
  const insets = useSafeAreaInsets();

  if (isOnline) return null;

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="bg-red-500 w-full absolute top-0 z-[999] flex-row items-center justify-center py-2 px-4 shadow-md"
    >
      <WifiOff size={14} color="white" />
      <Text className="text-white text-[11px] font-bold ml-2">
        Koneksi Terputus. Memeriksa jaringan...
      </Text>
    </View>
  );
}

export default function RootLayout() {
  const { isLoggedIn, hydrateAuth, loading } = useAuthStore();
  useEffect(() => {
    hydrateAuth();
  }, []);

  if (loading) {
    return null;
  }
  return (
    <GestureHandlerRootView >
      <SafeAreaProvider>
        <OfflineBanner />
        <Stack>
          {!isLoggedIn ? (
            <Stack.Screen name="auth" />
          ) : (
            <>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="product-detail" options={{ presentation: 'transparentModal' }} />
              <Stack.Screen name="product-create" options={{ presentation: 'transparentModal' }} />
            </>
          )}
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}