import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import useAuthStore from '@/store/useAuthStore';
import { Tabs, useRootNavigationState, useRouter, useSegments } from 'expo-router';
import { ClipboardList, History, LayoutDashboardIcon, Package2 } from 'lucide-react-native';
import React, { useEffect } from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { isLoggedIn } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  useEffect(() => {
    if (!navigationState?.key) return;
    const inAuthGroup = segments[0] === 'auth';
    if (!isLoggedIn && !inAuthGroup) {
      router.replace("/auth");
    } else if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments,navigationState?.key]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <LayoutDashboardIcon size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Stock',
          tabBarIcon: ({ color }) => <Package2 size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Transaction',
          tabBarIcon: ({ color }) => <ClipboardList size={28}  color={color} />,
        }}
      />
      <Tabs.Screen
        name="history-transaction"
        options={{
          title: 'History Transaction',
          tabBarIcon: ({ color }) => <History size={28}  color={color} />,
        }}
      />
    </Tabs>
  );
}
