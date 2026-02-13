import { useTransactionStore } from '@/store/useTransaction';
import { ArrowUpRight, Calendar, ChevronRight, ReceiptText, Search } from 'lucide-react-native';
import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HistoryTransaction = () => {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Hari Ini');
    const { histories, fetchHistories, isLoading } = useTransactionStore();

    useEffect(() => {
        let filterParam = "today";
        if (selectedFilter === "Minggu Ini") filterParam = "week";
        if (selectedFilter === "Bulan Ini") filterParam = "month";

        fetchHistories(filterParam);
    }, [selectedFilter]);

    // --- LOGIC SEARCH YANG AMAN ---
    const filteredHistory = useMemo(() => {
        const data = Array.isArray(histories) ? histories : [];
        
        if (!search.trim()) return data;

        const searchLower = search.toLowerCase();
        
        return data.filter((item) => {
            const name = item?.customerName?.toLowerCase() ?? '';
            const inv = item?.invoice?.toLowerCase() ?? '';
            
            return name.includes(searchLower) || inv.includes(searchLower);
        });
    }, [search, histories]);

    const totalOmzet = useMemo(() => {
        return filteredHistory.reduce(
            (sum, item) => sum + (Number(item?.totalPrice) || 0),
            0
        );
    }, [filteredHistory]);

    return (
        <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
            {/* Header */}
            <View className="px-6 py-4 flex-row justify-between items-center">
                <View>
                    <Text className="text-3xl font-black text-gray-900">Riwayat</Text>
                    <Text className="text-gray-400 font-medium">Pantau semua transaksi Anda</Text>
                </View>
                <TouchableOpacity className="bg-gray-100 p-3 rounded-2xl">
                    <Calendar size={24} color="#111827" />
                </TouchableOpacity>
            </View>

            {/* Statistik Omzet */}
            <View className="px-6 mb-6">
                <View className="bg-lime-400 p-6 rounded-[32px] flex-row justify-between items-center shadow-xl shadow-lime-200">
                    <View>
                        <Text className="text-white/80 font-bold text-xs uppercase tracking-widest">
                            Omzet {search ? '(Hasil Cari)' : `(${selectedFilter})`}
                        </Text>
                        <Text className="text-white text-3xl font-black mt-1">
                            Rp {totalOmzet.toLocaleString('id-ID')}
                        </Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <ArrowUpRight size={28} color="white" />
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-6 mb-4">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Cari Nama atau Invoice..."
                        className="flex-1 ml-3 font-medium text-gray-700"
                        value={search}
                        onChangeText={setSearch}
                        clearButtonMode="while-editing"
                        autoCorrect={false} // Best practice untuk search bar
                    />
                </View>
            </View>

            {/* List Transaksi */}
            <FlatList
                data={filteredHistory}
                keyExtractor={item => item?.id?.toString() ?? Math.random().toString()}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                // Tambahkan Loading State agar UX lebih bagus
                ListEmptyComponent={() => (
                    <View className="items-center mt-10">
                        {isLoading ? (
                            <ActivityIndicator color="#A3E635" />
                        ) : (
                            <Text className="text-gray-400 font-bold">Tidak ada transaksi</Text>
                        )}
                    </View>
                )}
                renderItem={({ item }) => {
                    const date = item?.createdAt ? new Date(item.createdAt) : new Date();
                    const time = date.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                    });

                    return (
                        <TouchableOpacity
                            activeOpacity={0.7}
                            className="bg-white border border-gray-100 p-5 rounded-[28px] mb-4 flex-row items-center shadow-sm"
                        >
                            <View className="bg-gray-50 p-4 rounded-2xl mr-4">
                                <ReceiptText size={24} color="#374151" />
                            </View>

                            <View className="flex-1">
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-2">
                                        <Text className="text-[10px] font-bold text-gray-400 uppercase">
                                            {item?.invoice ?? 'No Invoice'}
                                        </Text>
                                        <Text className="font-bold text-gray-800 text-base" numberOfLines={1}>
                                            {item?.customerName ?? 'Guest'}
                                        </Text>
                                    </View>
                                    <Text className="font-black text-gray-900 text-sm">
                                        Rp {(item?.totalPrice ?? 0).toLocaleString('id-ID')}
                                    </Text>
                                </View>

                                <View className="flex-row justify-between items-center mt-2">
                                    <Text className="text-gray-400 text-xs font-medium">
                                        {item?.amount ?? 0} Produk • {time}
                                    </Text>
                                    <ChevronRight size={16} color="#9CA3AF" />
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    );
};

export default HistoryTransaction;