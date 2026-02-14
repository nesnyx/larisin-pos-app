import { ENDPOINTS } from '@/constants/endpoints';
import api from '@/utils/api';
import { router } from 'expo-router';
import { Minus, Plus, ShoppingBag, X } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    KeyboardAvoidingView,
    Modal,
    PanResponder,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductCreateModal = () => {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [tempStock, setTempStock] = useState(0);
    const [editData, setEditData] = useState({
        name: '',
        price: '',
        category: ''
    });

    const categories = ['Makanan', 'Minuman', 'Snack', 'Elektronik', 'Lainnya'];

    // --- GESTURE LOGIC ---
    const panY = useRef(new Animated.Value(0)).current;
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
            onPanResponderMove: Animated.event([null, { dy: panY }], { useNativeDriver: false }),
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > 150) {
                    closeModal();
                } else {
                    Animated.spring(panY, { toValue: 0, useNativeDriver: false }).start();
                }
            },
        })
    ).current;

    const closeModal = () => {
        Animated.timing(panY, {
            toValue: 1000,
            duration: 300,
            useNativeDriver: false,
        }).start(() => router.back());
    };

    // --- VALIDATION & SUBMIT ---
    const isFormValid = editData.name.trim() !== '' && editData.price !== '' && !loading;

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setLoading(true);
        try {
            const payload = {
                name: editData.name.trim(),
                category: editData.category || 'Lainnya',
                price: Number(editData.price),
                stock: Number(tempStock)
            };

            const res = await api.post(ENDPOINTS.PRODUCTS.CREATE, payload);

            // Mengasumsikan backend mengembalikan status 200/201 untuk sukses
            if (res.status === 200 || res.status === 201) {
                console.log("Success:", res.data);
                router.back();
            }
        } catch (error: any) {
            console.error("Submit Error:", error);
            const errorMsg = error.response?.data?.message || "Terjadi kesalahan saat menyimpan produk";
            Alert.alert("Gagal", errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal animationType="slide" // Ganti ke slide agar lebih smooth dari bawah
            transparent={true}
            visible={true} // Pastikan ada props visible
            statusBarTranslucent>
            <View className="flex-1 bg-black/50 justify-end">
                <Animated.View
                    style={{
                        transform: [{
                            translateY: panY.interpolate({
                                inputRange: [0, 1000],
                                outputRange: [0, 1000],
                                extrapolate: 'clamp'
                            })
                        }]
                    }}
                    className="bg-white rounded-t-[40px] h-[92%]"
                >
                    {/* Handle Bar untuk Swipe */}
                    <View {...panResponder.panHandlers} className="items-center pt-4 pb-2">
                        <View className="w-16 h-1.5 bg-gray-200 rounded-full" />
                    </View>

                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        className="flex-1"
                    >
                        {/* Header */}
                        <View className="flex-row justify-between items-center px-8 mb-6 mt-2">
                            <View>
                                <Text className="text-2xl font-black text-gray-900">Produk Baru</Text>
                                <Text className="text-gray-400 text-xs font-medium">Lengkapi inventaris toko</Text>
                            </View>
                            <TouchableOpacity
                                onPress={closeModal}
                                className="bg-gray-100 p-2 rounded-full"
                                disabled={loading}
                            >
                                <X size={20} color="#374151" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
                            <View className="gap-y-6">
                                {/* Input Nama */}
                                <View>
                                    <Text className="text-gray-900 mb-2 font-bold ml-1">Nama Produk</Text>
                                    <TextInput
                                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-800 text-base focus:border-lime-400"
                                        placeholder="Ketik nama produk..."
                                        value={editData.name}
                                        onChangeText={(txt) => setEditData({ ...editData, name: txt })}
                                        editable={!loading}
                                    />
                                </View>

                                {/* Input Harga */}
                                <View>
                                    <Text className="text-gray-900 mb-2 font-bold ml-1">Harga Jual</Text>
                                    <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4 focus:border-lime-400">
                                        <Text className="text-gray-400 font-bold mr-2">Rp</Text>
                                        <TextInput
                                            className="flex-1 py-4 text-gray-800 text-base"
                                            placeholder="0"
                                            keyboardType="numeric"
                                            value={editData.price}
                                            onChangeText={(txt) => setEditData({ ...editData, price: txt.replace(/[^0-9]/g, '') })}
                                            editable={!loading}
                                        />
                                    </View>
                                </View>

                                {/* Input Kategori */}
                                <View>
                                    <Text className="text-gray-900 mb-2 font-bold ml-1">Kategori</Text>
                                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mb-3">
                                        {categories.map((cat) => (
                                            <TouchableOpacity
                                                key={cat}
                                                onPress={() => setEditData({ ...editData, category: cat })}
                                                disabled={loading}
                                                className={`mr-2 px-4 py-2 rounded-full border ${editData.category === cat ? 'bg-lime-400 border-lime-400' : 'bg-white border-gray-200'}`}
                                            >
                                                <Text className={`font-bold text-xs ${editData.category === cat ? 'text-white' : 'text-gray-500'}`}>{cat}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </ScrollView>
                                    <TextInput
                                        className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-800 text-base"
                                        placeholder="Atau ketik kategori baru..."
                                        value={editData.category}
                                        onChangeText={(txt) => setEditData({ ...editData, category: txt })}
                                        editable={!loading}
                                    />
                                </View>

                                {/* Manajemen Stok */}
                                <View>
                                    <Text className="text-gray-900 font-bold mb-4 text-lg ml-1">Stok Awal</Text>
                                    <View className="flex-row items-center justify-between bg-gray-50 border border-gray-100 p-5 rounded-[28px]">
                                        <TouchableOpacity
                                            onPress={() => setTempStock(Math.max(0, tempStock - 1))}
                                            disabled={loading}
                                            className="bg-white w-14 h-14 rounded-2xl items-center justify-center shadow-sm"
                                        >
                                            <Minus size={24} color="#374151" />
                                        </TouchableOpacity>
                                        <View className="items-center">
                                            <Text className="text-4xl font-black text-gray-900">{tempStock}</Text>
                                            <Text className="text-gray-400 text-[10px] font-bold uppercase">Unit</Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => setTempStock(tempStock + 1)}
                                            disabled={loading}
                                            className="bg-lime-400 w-14 h-14 rounded-2xl items-center justify-center shadow-md shadow-lime-200"
                                        >
                                            <Plus size={24} color="white" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View className="h-10" />

                            {/* Tombol Simpan */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                activeOpacity={0.8}
                                disabled={!isFormValid}
                                className={`h-16 rounded-[24px] flex-row items-center justify-center mb-10 ${isFormValid ? 'bg-gray-900' : 'bg-gray-300'
                                    }`}
                            >
                                {loading ? (
                                    <View className="flex-row items-center">
                                        <ActivityIndicator color="white" size="small" />
                                        <Text className="text-white font-bold text-base ml-2">Mohon Tunggu</Text>
                                    </View>
                                ) : (
                                    <>
                                        <ShoppingBag size={20} color="white" />
                                        <Text className="text-white font-bold text-base ml-2">Simpan Produk</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </ScrollView>
                    </KeyboardAvoidingView>
                </Animated.View>
            </View>
        </Modal>
    );
};

export default ProductCreateModal;