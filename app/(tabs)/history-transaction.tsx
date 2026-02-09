import { ArrowUpRight, Calendar, ChevronRight, ReceiptText, Search } from 'lucide-react-native';
import React, { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HistoryTransaction = () => {
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('Hari Ini');

    // Data Master (Biasanya dari API/Database)
    const historyData = [
        { id: '1', invoice: 'INV-001', customer: 'Budi Santoso', total: 45000, time: '10:30', items: 3, status: 'Selesai' },
        { id: '2', invoice: 'INV-002', customer: 'Siti Aminah', total: 12000, time: '11:15', items: 1, status: 'Selesai' },
        { id: '3', invoice: 'INV-003', customer: 'Walk-in Customer', total: 85000, time: '13:00', items: 5, status: 'Selesai' },
        { id: '4', invoice: 'INV-004', customer: 'Rudi Tabuti', total: 25000, time: '14:20', items: 2, status: 'Selesai' },
    ];

    const filters = ['Hari Ini', 'Minggu Ini', 'Bulan Ini'];

    // --- LOGIC SEARCH DENGAN USEMEMO ---
    const filteredHistory = useMemo(() => {
        console.log('Filtering data...'); // Cek di console untuk bukti memoization
        if (!search.trim()) return historyData;

        return historyData.filter((item) => {
            const searchLower = search.toLowerCase();
            return (
                item.customer.toLowerCase().includes(searchLower) ||
                item.invoice.toLowerCase().includes(searchLower)
            );
        });
    }, [search, historyData]); // Hanya hitung ulang jika search atau data berubah

    // Hitung Total Omzet dari hasil filter (opsional, biar dinamis)
    const totalOmzet = useMemo(() => {
        return filteredHistory.reduce((sum, item) => sum + item.total, 0);
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

            {/* Statistik Singkat - Dinamis sesuai hasil search */}
            <View className="px-6 mb-6">
                <View className="bg-lime-400 p-6 rounded-[32px] flex-row justify-between items-center shadow-xl shadow-lime-200">
                    <View>
                        <Text className="text-white/80 font-bold text-xs uppercase tracking-widest">
                            Omzet {search ? '(Hasil Cari)' : `(${selectedFilter})`}
                        </Text>
                        <Text className="text-white text-3xl font-black mt-1">
                            Rp {totalOmzet.toLocaleString()}
                        </Text>
                    </View>
                    <View className="bg-white/20 p-3 rounded-2xl">
                        <ArrowUpRight size={28} color="white" />
                    </View>
                </View>
            </View>

            {/* Search Bar */}
            <View className="px-6 mb-4">
                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 py-3 border border-gray-100 mb-4">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput 
                        placeholder="Cari Nama atau Invoice..." 
                        className="flex-1 ml-3 font-medium text-gray-700"
                        value={search}
                        onChangeText={setSearch}
                        clearButtonMode="while-editing" // Khusus iOS biar ada tombol (x)
                    />
                </View>
                
                {/* Filter Chips */}
                <View className="flex-row">
                    {filters.map((f) => (
                        <TouchableOpacity 
                            key={f}
                            onPress={() => setSelectedFilter(f)}
                            className={`mr-2 px-5 py-2.5 rounded-full ${selectedFilter === f ? 'bg-gray-900' : 'bg-gray-100'}`}
                        >
                            <Text className={`font-bold text-xs ${selectedFilter === f ? 'text-white' : 'text-gray-500'}`}>{f}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* List Transaksi */}
            <FlatList 
                data={filteredHistory}
                keyExtractor={item => item.id}
                contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        className="bg-white border border-gray-100 p-5 rounded-[28px] mb-4 flex-row items-center shadow-sm"
                    >
                        <View className="bg-gray-50 p-4 rounded-2xl mr-4">
                            <ReceiptText size={24} color="#374151" />
                        </View>

                        <View className="flex-1">
                            <View className="flex-row justify-between items-start">
                                <View>
                                    <Text className="text-[10px] font-bold text-gray-400 uppercase">{item.invoice}</Text>
                                    <Text className="font-bold text-gray-800 text-base">{item.customer}</Text>
                                </View>
                                <Text className="font-black text-gray-900 text-sm">Rp {item.total.toLocaleString()}</Text>
                            </View>
                            
                            <View className="flex-row justify-between items-center mt-2">
                                <Text className="text-gray-400 text-xs font-medium">{item.items} Produk • {item.time}</Text>
                                <ChevronRight size={16} color="#9CA3AF" />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View className="items-center mt-20">
                        <Text className="text-gray-300 font-bold">Transaksi tidak ditemukan</Text>
                    </View>
                }
            />
        </View>
    );
};

export default HistoryTransaction;