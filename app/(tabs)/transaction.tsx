import { ChevronRight, Minus, Plus, Search, ShoppingBag, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TransactionPage = () => {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [cart, setCart] = useState([]);
    const [isCartVisible, setIsCartVisible] = useState(false);

    // Dummy Data
    const products = [
        { id: '1', name: 'Kopi Susu Gula Aren', price: 15000, stock: 20, category: 'Minuman' },
        { id: '2', name: 'Roti Bakar Cokelat', price: 12000, stock: 15, category: 'Makanan' },
        { id: '3', name: 'Es Teh Manis', price: 5000, stock: 50, category: 'Minuman' },
        { id: '4', name: 'Kentang Goreng', price: 18000, stock: 10, category: 'Snack' },
    ];

    const addToCart = (product:any) => {
        setCart((prev:any) => {
            const existing = prev.find((item:any) => item.id === product.id);
            if (existing) {
                return prev.map((item:any) => 
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            return [...prev, { ...product, qty: 1 }];
        });
    };

    const updateQty = (id:any, delta:any) => {
        setCart((prev:any) => prev.map((item:any) => 
            item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item
        ).filter((item:any) => item.qty > 0));
    };

    const totalItem = cart.reduce((sum : any, item : any) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum : any, item : any) => sum + (item.price * item.qty), 0);

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-3xl font-black text-gray-900">Pilih Produk</Text>
                    <Text className="text-gray-400 font-medium">Mau pesan apa hari ini?</Text>
                </View>
                <TouchableOpacity 
                    onPress={() => setIsCartVisible(true)}
                    className="bg-gray-100 p-3 rounded-2xl relative"
                >
                    <ShoppingBag size={24} color="#111827" />
                    {totalItem > 0 && (
                        <View className="absolute -top-1 -right-1 bg-lime-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                            <Text className="text-[10px] text-white font-bold">{totalItem}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="px-6 mb-4">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Cari menu favorit..." 
                        className="flex-1 ml-3 font-medium text-gray-700"
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>
            </View>

            {/* Product Grid */}
            <FlatList 
                data={products}
                numColumns={2}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => addToCart(item)}
                        activeOpacity={0.7}
                        className="flex-1 m-2 bg-white border border-gray-100 p-4 rounded-[32px] shadow-sm shadow-black/5"
                    >
                        <View className="bg-lime-100 self-start px-2 py-1 rounded-lg mb-2">
                            <Text className="text-[10px] font-bold text-lime-700 uppercase">{item.category}</Text>
                        </View>
                        <Text className="font-bold text-gray-800 text-base mb-1" numberOfLines={2}>{item.name}</Text>
                        <Text className="text-gray-400 text-xs mb-3">Stok: {item.stock}</Text>
                        <View className="flex-row justify-between items-center mt-auto">
                            <Text className="font-black text-gray-900 text-sm">Rp {item.price.toLocaleString()}</Text>
                            <View className="bg-gray-900 p-2 rounded-xl">
                                <Plus size={16} color="white" />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

            {/* Floating Bar Keranjang (Hanya muncul jika ada isi) */}
            {totalItem > 0 && (
                <View className="absolute bottom-10 left-6 right-6 shadow-2xl shadow-lime-500/50">
                    <TouchableOpacity 
                        onPress={() => setIsCartVisible(true)}
                        activeOpacity={0.9}
                        className="bg-lime-400 flex-row items-center justify-between p-5 rounded-[28px]"
                    >
                        <View className="flex-row items-center">
                            <View className="bg-white/20 p-2 rounded-xl">
                                <ShoppingBag size={20} color="white" />
                            </View>
                            <View className="ml-3">
                                <Text className="text-white font-bold text-base">{totalItem} Item</Text>
                                <Text className="text-white/80 text-xs font-medium">Rp {totalPrice.toLocaleString()}</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center">
                            <Text className="text-white font-bold mr-1">Lihat Keranjang</Text>
                            <ChevronRight size={20} color="white" />
                        </View>
                    </TouchableOpacity>
                </View>
            )}

            {/* Modal Keranjang Terpisah */}
            <Modal visible={isCartVisible} animationType="slide" transparent={true}>
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-[40px] h-[80%]">
                        <View className="items-center pt-4 pb-2">
                            <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </View>
                        
                        <View className="px-8 flex-row justify-between items-center mb-6">
                            <Text className="text-2xl font-black text-gray-900">Keranjang</Text>
                            <TouchableOpacity onPress={() => setIsCartVisible(false)} className="bg-gray-100 p-2 rounded-full">
                                <X size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="px-8 flex-1">
                            {cart.length === 0 ? (
                                <View className="items-center mt-20">
                                    <Text className="text-gray-400 font-medium">Keranjang masih kosong nih...</Text>
                                </View>
                            ) : (
                                cart.map((item:any) => (
                                    <View key={item.id} className="flex-row items-center mb-6">
                                        <View className="flex-1">
                                            <Text className="font-bold text-gray-800 text-base">{item.name}</Text>
                                            <Text className="text-gray-400 text-sm">Rp {item.price.toLocaleString()}</Text>
                                        </View>
                                        <View className="flex-row items-center bg-gray-100 rounded-2xl p-1">
                                            <TouchableOpacity 
                                                onPress={() => updateQty(item.id, -1)}
                                                className="bg-white p-2 rounded-xl shadow-sm"
                                            >
                                                <Minus size={16} color="#374151" />
                                            </TouchableOpacity>
                                            <Text className="mx-4 font-black text-gray-900 text-lg">{item.qty}</Text>
                                            <TouchableOpacity 
                                                onPress={() => updateQty(item.id, 1)}
                                                className="bg-gray-900 p-2 rounded-xl shadow-sm"
                                            >
                                                <Plus size={16} color="white" />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))
                            )}
                        </ScrollView>

                        {/* Summary Footer */}
                        <View className="px-8 pt-6 border-t border-gray-50" style={{ paddingBottom: insets.bottom + 20 }}>
                            <View className="flex-row justify-between items-center mb-6">
                                <View>
                                    <Text className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Pembayaran</Text>
                                    <Text className="text-2xl font-black text-gray-900">Rp {totalPrice.toLocaleString()}</Text>
                                </View>
                            </View>
                            <TouchableOpacity 
                                disabled={cart.length === 0}
                                className="bg-gray-900 h-16 rounded-[24px] flex-row items-center justify-center shadow-xl shadow-black/20"
                            >
                                <Text className="text-white font-bold text-lg">Bayar Sekarang</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default TransactionPage;