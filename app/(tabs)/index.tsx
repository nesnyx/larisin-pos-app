import { useProductsStore } from "@/store/useProductsStore";
import { useTransactionStore } from "@/store/useTransaction";
import { useFocusEffect, useRouter } from "expo-router";
import {
  LockIcon,
  Package,
  Plus,
  ShoppingBag,
  Users,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProfileModal from "../profile";

const DashboardUMKM = () => {
  const { items, fetchProduct } = useProductsStore();
  const [isProfileVisible, setIsProfileVisible] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { totalTransactions, totalRevenuePerDay, totalTransactionAndRevenue } =
    useTransactionStore();
  const router = useRouter();
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.all([fetchProduct(5), totalTransactionAndRevenue()]);
    setIsRefreshing(false);
  }, []);
  useFocusEffect(
    useCallback(() => {
      fetchProduct(5);
      totalTransactionAndRevenue();
      return () => {};
    }, []),
  );
  return (
    <SafeAreaView className="flex-1 bg-gray-50 px-5 pt-12">
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View className="px-6">
          <View className="flex-row justify-between items-center mb-8">
            <View>
              <Text className="text-gray-500 text-sm">Selamat Pagi,</Text>
              <Text className="text-2xl font-bold text-gray-900">
                Kedai Kita{" "}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsProfileVisible(true)}
              className="w-12 h-12 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
            >
              <Users size={20}  />
            </TouchableOpacity>
            <ProfileModal
              visible={isProfileVisible}
              onClose={() => setIsProfileVisible(false)}
            />
          </View>

          <View className="bg-lime-400 p-6 rounded-[32px] mb-8 shadow-xl shadow-lime-400/30">
            <Text className="text-lime-900 font-medium opacity-80">
              Total Pendapatan Penjualan
            </Text>
            <View className="flex-row items-end mt-1">
              <Text className="text-4xl font-extrabold text-lime-950">
                Rp {totalRevenuePerDay.toLocaleString("id-ID")}
              </Text>
            </View>
          </View>

          {/* Secondary Stats */}
          <View className="flex-row justify-between mb-8">
            <View className="bg-white p-5 rounded-[24px] w-[47%] border border-gray-100 shadow-sm">
              <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <ShoppingBag size={20} />
              </View>
              <Text className="text-gray-500 text-xs">Transaksi</Text>
              <Text className="text-xl font-bold">{totalTransactions}</Text>
            </View>
            <View className="bg-gray-300 p-5 rounded-[24px] w-[47%] border border-gray-100 shadow-sm">
              <View className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center mb-3">
                <LockIcon size={24}  />
              </View>
              <Text className="text-gray-500 text-xs">Laba Bersih</Text>
              <Text className="text-xl font-bold">Rp ---</Text>
            </View>
          </View>

          <Text className="text-lg font-bold text-gray-900 mb-4">
            Aksi Cepat
          </Text>
          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                router.push({
                  pathname: "/product-create",
                });
              }}
              className="flex-1 bg-white p-4 rounded-2xl border border-dashed border-gray-300 items-center"
            >
              <Plus size={24}  />
              <Text className="text-gray-600 mt-2 font-medium">
                Tambah Stok
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={true}
              className="flex-1 bg-gray-300 p-4 rounded-2xl border border-dashed border-gray-300 items-center"
            >
              <LockIcon size={24} />
              <Text className="text-white-600 mt-2 font-medium">
                Buka Kasir
              </Text>
            </TouchableOpacity>
          </View>

          {/* Top Products - Brief List */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Produk Tersedia
            </Text>
            <TouchableOpacity onPress={() => router.replace("/stock")}>
              <Text className="text-lime-600 font-bold">Lihat Semua</Text>
            </TouchableOpacity>
          </View>

          {items.length !== 0 ? (
            items.map((item: any, index) => (
              <View
                key={index}
                className="bg-white p-4 rounded-2xl mb-3 flex-row items-center border border-gray-50"
              >
                <View className="flex-1">
                  <Text className="font-bold text-gray-800">{item.name}</Text>
                  <Text className="text-gray-500 text-xs">
                    {item.stock} Stock
                  </Text>
                </View>
                <Text className="font-bold text-gray-900">
                  Rp {item.price.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <View className="items-center justify-center mt-5">
              <Package size={32}  />
              <Text className="text-gray-400 mt-4 font-semibold text-sm">
                Produk tidak ditemukan
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardUMKM;
