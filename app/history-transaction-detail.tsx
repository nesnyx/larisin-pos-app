import { useLocalSearchParams, useRouter } from "expo-router";
import { BoxIcon, CircleDollarSign, Info, ReceiptText, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ENDPOINTS } from "@/constants/endpoints";
import api from "@/utils/api";

export default function HistoryTransactionDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();

  const [detailData, setDetailData] = useState<any>(null);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      try {
        const res = await api.get(
          ENDPOINTS.TRANSACTIONS.DETAIL(id as string)
        );
        setDetailData(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDetail();
  }, [id]);

  if (!detailData) return null;

  return (
    <View className="flex-1">
      <Modal animationType="slide" transparent visible>
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-[40px]"
            style={{ paddingBottom: insets.bottom + 20, paddingTop: 20 }}
          >
            <View className="flex-row justify-between items-center px-8 mb-6">
              <Text className="text-xl font-black text-gray-900">
                Detail Transaction
              </Text>
              <TouchableOpacity
                onPress={() => router.back()}
                className="bg-gray-100 p-2 rounded-full"
              >
                <X size={20} />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
              <View className="flex-row items-center mb-8">
                <View className="bg-lime-100 p-3 rounded-2xl">
                  <ReceiptText size={24} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-500 font-medium">
                    Customer
                  </Text>
                  <Text className="text-gray-900 font-bold">
                    {detailData.customerName}
                  </Text>

                </View>

              </View>
              <View className="flex-row items-center mb-8">
                <View className="bg-lime-100 p-3 rounded-2xl">
                  <CircleDollarSign size={24} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-500 font-medium">
                    Total
                  </Text>
                  <Text className="text-gray-900 font-bold">
                    {detailData.totalPrice.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center mb-8">
                <View className="bg-lime-100 p-3 rounded-2xl">
                  <CircleDollarSign size={24} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-500 font-medium">
                    Pay Amount
                  </Text>
                  <Text className="text-gray-900 font-bold">
                    {detailData.charge.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </Text>
                </View>

              </View>
              <View className="flex-row items-center mb-8">
                <View className="bg-lime-100 p-3 rounded-2xl">
                  <Info size={24} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-500 font-medium">
                    Status
                  </Text>
                  <Text className="text-gray-900 font-bold">
                    {detailData.status}
                  </Text>
                </View>

              </View>
              <View className="flex-row items-center mb-8">
                <View className="bg-lime-100 p-3 rounded-2xl">
                  <BoxIcon size={24} />
                </View>
                <View className="ml-4">
                  <Text className="text-gray-500 font-medium">
                    Items
                  </Text>
                  <View className="bg-gray-50 p-4 rounded-2xl">
                    <View>
                      {detailData.transactionItems.map((item: any) => (
                        <Text
                          key={item.id}
                          className="text-gray-900 font-bold mb-1"
                        >
                          {item.productName} x {item.quantity}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>

              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}