import { useRouter } from 'expo-router';
import { AlertCircle, Filter, MoreHorizontal, Package, Plus, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

// --- DATA DUMMY ---
const INITIAL_PRODUCTS = [
  { id: '1', name: 'Berry Cake', price: 12500, stock: 15, category: 'Bakery', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { id: '2', name: 'Green Apple', price: 8000, stock: 4, category: 'Fruit', image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400' },
  { id: '3', name: 'Black Tea', price: 5000, stock: 0, category: 'Drink', image: 'https://images.unsplash.com/photo-1544787210-22bb830d596c?w=400' },
  { id: '4', name: 'Almond Croissant', price: 22000, stock: 8, category: 'Bakery', image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400' },
];

const InventoryScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [products] = useState(INITIAL_PRODUCTS);
  
  // Filter logika
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // --- COMPONENT: HEADER (Memoized to prevent keyboard flicker) ---
  const ListHeader = useMemo(() => (
    <View className="px-6 pb-4 bg-gray-50">
      {/* Top Bar */}
      <View className="flex-row justify-between items-center py-6">
        <View>
          <Text className="text-3xl font-black text-gray-900 tracking-tight">Inventori</Text>
          <Text className="text-gray-500 font-medium">{products.length} Produk Terdaftar</Text>
        </View>
        <TouchableOpacity 
          activeOpacity={0.7}
          onPress={()=>{
            router.push({
            pathname:"/product-create"
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
  ), [search, products.length]);

  // --- COMPONENT: ITEM CARD ---
  const renderProductItem = ({ item } : any) => {
    const isLowStock = item.stock > 0 && item.stock <= 5;
    const isEmpty = item.stock === 0;

    return (
      <TouchableOpacity 
        activeOpacity={0.8}
        className="mx-6 mb-4 bg-white rounded-[28px] p-4 flex-row items-center border border-gray-50 shadow-sm shadow-gray-200"
        onPress={()=>{
          router.push({
            pathname:"/product-detail",
            params:{
              ...item
            }
          })
        }}
      >
        <View className="relative">
          <Image source={{ uri: item.image }} className="w-20 h-20 rounded-2xl bg-gray-100" />
          {isEmpty && (
            <View className="absolute inset-0 bg-black/50 rounded-2xl items-center justify-center">
              <Text className="text-white text-[10px] font-black uppercase">Habis</Text>
            </View>
          )}
        </View>

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
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id}
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