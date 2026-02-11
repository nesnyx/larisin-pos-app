import { useColorScheme } from '@/hooks/use-color-scheme';
import useAuthStore from '@/store/useAuthStore';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import "../global.css";

export const unstable_settings = {
  initialRouteName: 'auth',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';
    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/auth");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/');
    }
  }, [isLoggedIn, segments]);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <SafeAreaProvider>
        <Stack initialRouteName='auth'>
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="product-detail" options={{ headerShown: false, presentation: 'transparentModal', title: 'Detail Produk' }} />
          <Stack.Screen name="product-create" options={{ headerShown: false, presentation: 'transparentModal', title: 'Tambah Produk' }} />
        </Stack>
      </SafeAreaProvider>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
