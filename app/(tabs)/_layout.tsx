import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { ClipboardList, History, LayoutDashboardIcon, Package2 } from 'lucide-react-native';
import React from 'react';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets(); // Untuk handle notch dan navigation bar Android
  

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarInactiveTintColor: '#9CA3AF', // Gray-400 agar lebih jelas
        headerShown: false,
        tabBarButton: HapticTab,
        // --- OPTIMASI RESPONSIVE ---
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#111827' : '#FFFFFF',
          borderTopWidth: 0,
          elevation: 20, // Shadow untuk Android
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          // Mengatur tinggi tab bar berdasarkan insets (penting untuk Android baru)
          height: Platform.OS === 'ios' ? 88 : 85 + (insets.bottom > 0 ? insets.bottom / 2 : 10),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 12,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          marginBottom: Platform.OS === 'android' ? 8 : 0, // Padding khusus android
        },
        tabBarIconStyle: {
          marginBottom: Platform.OS === 'android' ? 2 : 0,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <LayoutDashboardIcon size={focused ? 26 : 24}  />
          ),
        }}
      />
      <Tabs.Screen
        name="stock"
        options={{
          title: 'Inventori',
          tabBarLabel: 'Stock',
          tabBarIcon: ({ color, focused }) => (
            <Package2 size={focused ? 26 : 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="transaction"
        options={{
          title: 'Kasir',
          tabBarLabel: 'Pos',
          tabBarIcon: ({ color, focused }) => (
            <ClipboardList size={focused ? 26 : 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="history-transaction"
        options={{
          title: 'Riwayat',
          tabBarLabel: 'History',
          tabBarIcon: ({ color, focused }) => (
            <History size={focused ? 26 : 24}  />
          ),
        }}
      />
    </Tabs>
  );
}