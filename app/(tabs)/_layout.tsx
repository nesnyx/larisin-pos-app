import { HapticTab } from '@/components/haptic-tab';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import { ClipboardList, LayoutDashboardIcon, Package2 } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
    </Tabs>
  );
}
