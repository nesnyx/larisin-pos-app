import { ArrowUpRight, Plus, ShoppingBag, TrendingUp, Users } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const DashboardUMKM = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 pt-12">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-6">
          {/* Header Section */}
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-gray-500 text-sm">Selamat Pagi,</Text>
              <Text className="text-2xl font-bold text-gray-900">Kedai Kopi Kita ☕</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm">
              <Users size={20} color="#111827" />
            </TouchableOpacity>
          </View>

          {/* Main Stats Card */}
          <View className="bg-lime-400 p-6 rounded-[32px] mb-8 shadow-xl shadow-lime-400/30">
            <Text className="text-lime-900 font-medium opacity-80">Total Penjualan Hari Ini</Text>
            <View className="flex-row items-end mt-1">
              <Text className="text-4xl font-extrabold text-lime-950">Rp 2.450.000</Text>
            </View>
            <View className="flex-row items-center mt-4 bg-lime-500/20 self-start px-3 py-1 rounded-full">
              <ArrowUpRight size={16} color="#064e3b" />
              <Text className="text-green-900 ml-1 font-bold">+12% vs kemarin</Text>
            </View>
          </View>

          {/* Secondary Stats */}
          <View className="flex-row justify-between mb-8">
            <View className="bg-white p-5 rounded-[24px] w-[47%] border border-gray-100 shadow-sm">
              <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <ShoppingBag size={20} color="#3b82f6" />
              </View>
              <Text className="text-gray-500 text-xs">Transaksi</Text>
              <Text className="text-xl font-bold">48</Text>
            </View>
            <View className="bg-white p-5 rounded-[24px] w-[47%] border border-gray-100 shadow-sm">
              <View className="bg-orange-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <TrendingUp size={20} color="#f97316" />
              </View>
              <Text className="text-gray-500 text-xs">Laba Bersih</Text>
              <Text className="text-xl font-bold">Rp 840rb</Text>
            </View>
          </View>

          {/* Quick Actions */}
          <Text className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</Text>
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity className="flex-1 bg-white p-4 rounded-2xl border border-dashed border-gray-300 items-center">
              <Plus size={24} color="#6B7280" />
              <Text className="text-gray-600 mt-2 font-medium">Tambah Stok</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 bg-white p-4 rounded-2xl border border-dashed border-gray-300 items-center">
              <Plus size={24} color="#6B7280" />
              <Text className="text-gray-600 mt-2 font-medium">Buka Kasir</Text>
            </TouchableOpacity>
          </View>

          {/* Top Products - Brief List */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">Produk Terlaris</Text>
            <TouchableOpacity><Text className="text-lime-600 font-bold">Lihat Semua</Text></TouchableOpacity>
          </View>

          {['Kopi Susu Gula Aren', 'Croissant Almond'].map((item, index) => (
            <View key={index} className="bg-white p-4 rounded-2xl mb-3 flex-row items-center border border-gray-50">
              <View className="w-12 h-12 bg-gray-100 rounded-xl mr-4" />
              <View className="flex-1">
                <Text className="font-bold text-gray-800">{item}</Text>
                <Text className="text-gray-500 text-xs">{20 - index * 5} terjual hari ini</Text>
              </View>
              <Text className="font-bold text-gray-900">Rp {index === 0 ? '18.000' : '25.000'}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

    </SafeAreaView>
  );
};

export default DashboardUMKM;