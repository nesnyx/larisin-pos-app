import { useProductsStore } from '@/store/useProductsStore';
import { useFocusEffect, useRouter } from 'expo-router';
import { AlertCircle, Filter, MoreHorizontal, Package, Plus, Search } from 'lucide-react-native';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


const InventoryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const items = useProductsStore(state => state.items)
  const fetchProduct = useProductsStore(state => state.fetchProduct)


  const filteredItems = useMemo(() => {
    return items.filter((product: any) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, items]); // Berjalan ulang jika 'search' atau 'items' berubah

  useFocusEffect(
    useCallback(() => {
      fetchProduct();
      return () => { };
    }, []),
  );




  const ListHeader = useMemo(() => (
    <View className="px-6 pb-4 bg-gray-50">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center py-6">
        <View>
          <Text className="text-3xl font-black text-gray-900 tracking-tight">Inventori</Text>
          <Text className="text-gray-500 font-medium">{items.length} Produk Terdaftar</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            router.push({
              pathname: "/product-create"
            })
          }}
          className="bg-lime-400 w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-lime-400/40"
        >
          <Plus size={30} color="white" strokeWidth={3} />
        </TouchableOpacity>
      </View>

      {/* Search & Filter */}
      <View className="flex-row gap-3 mb-2">
        <View className="flex-1 flex-row items-center bg-white border border-gray-100 rounded-2xl px-4 shadow-sm h-14">
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Cari produk..."
            className="flex-1 ml-3 font-semibold text-gray-800 h-full"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            clearButtonMode="while-editing"
          />
        </View>
        <TouchableOpacity className="bg-white border border-gray-100 w-14 h-14 rounded-2xl items-center justify-center shadow-sm">
          <Filter size={20} color="#374151" />
        </TouchableOpacity>
      </View>
    </View>
  ), [search, items.length]);

  // --- COMPONENT: ITEM CARD ---
  const renderProductItem = ({ item }: any) => {
    const isLowStock = item.stock > 0 && item.stock <= 5;
    const isEmpty = item.stock === 0;

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        className="mx-6 mb-4 bg-white rounded-[28px] p-4 flex-row items-center border border-gray-50 shadow-sm shadow-gray-200"
        onPress={() => {
          router.push({
            pathname: "/product-detail",
            params: {
              ...item
            }
          })
        }}
      >


        <View className="flex-1 ml-4 justify-between h-20 py-1">
          <Text className="text-[10px] font-bold text-lime-600 uppercase tracking-widest mb-1">{item.category}</Text>
          <Text className="text-base font-bold text-gray-800 leading-5" numberOfLines={1}>{item.name}</Text>

          <View className="flex-row items-center mt-2">
            <Text className="text-gray-900 font-black text-lg">Rp {item.price.toLocaleString()}</Text>
          </View>
        </View>

        <View className="items-end justify-between h-20 py-1">
          <TouchableOpacity className="p-1">
            <MoreHorizontal size={22} color="#9CA3AF" />
          </TouchableOpacity>

          <View className={`flex-row items-center px-3 py-1.5 rounded-xl ${isEmpty ? 'bg-red-50' : isLowStock ? 'bg-amber-50' : 'bg-gray-50'}`}>
            {isLowStock || isEmpty ? (
              <AlertCircle size={12} color={isEmpty ? "#EF4444" : "#F59E0B"} />
            ) : (
              <Package size={12} color="#6B7280" />
            )}
            <Text className={`text-[11px] ml-1 font-bold ${isEmpty ? 'text-red-600' : isLowStock ? 'text-amber-600' : 'text-gray-600'}`}>
              {item.stock}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="dark-content" />

      {/* KeyboardAvoidingView memastikan input tidak tertutup keyboard di iOS/Android */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <FlatList
          data={filteredItems}
          renderItem={renderProductItem}
          keyExtractor={(item: any) => item.id}
          ListHeaderComponent={ListHeader}
          // Agar ListHeader (termasuk search bar) berhenti tepat di bawah notch
          contentContainerStyle={{
            paddingTop: insets.top,
            paddingBottom: insets.bottom + 100
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          // Mencegah lag saat scrolling
          initialNumToRender={7}
          maxToRenderPerBatch={10}
          removeClippedSubviews={true}
          windowSize={5}
          ListEmptyComponent={() => (
            <View className="items-center justify-center mt-20">
              <Package size={64} color="#E5E7EB" />
              <Text className="text-gray-400 mt-4 font-semibold text-lg">Produk tidak ditemukan</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

// Wrapper agar Safe Area Context terbaca
export default function Stock() {
  return (
    <SafeAreaProvider>
      <InventoryScreen />
    </SafeAreaProvider>
  );
}