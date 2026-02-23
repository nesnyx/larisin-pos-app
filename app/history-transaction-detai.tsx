import { useLocalSearchParams, useRouter } from "expo-router";
import { ReceiptText, X } from "lucide-react-native";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HistoryTransactionDetail() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params: any = useLocalSearchParams();
  return (
    <View className="flex-1">
      <Modal animationType="slide" transparent={true} visible={true}>
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
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
              <View>
                <View className="flex-row items-center mb-8">
                  <View className="bg-lime-100 p-3 rounded-2xl">
                    <ReceiptText size={24} color="#65A30D" />
                  </View>
                  <View className="ml-4">
                    <Text className="text-gray-500 font-medium">Customer</Text>
                    <Text className="text-gray-900 font-bold">
                      {params.customerName}
                    </Text>
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
