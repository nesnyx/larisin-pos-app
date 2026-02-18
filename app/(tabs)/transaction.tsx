import CustomAlert from "@/components/custom-alert";
import { useProductsStore } from "@/store/useProductsStore";
import { useTransactionStore } from "@/store/useTransaction";
import {
    ChevronRight,
    Minus,
    Plus,
    ShoppingBag,
    User,
    Wallet,
    X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TransactionPage = () => {
  const insets = useSafeAreaInsets();
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isCheckoutVisible, setIsCheckoutVisible] = useState(false);
  const { checkout, isLoading } = useTransactionStore();
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    type: "info" as "success" | "error" | "info",
    title: "",
    message: "",
  });
  const notify = (
    title: string,
    msg: string,
    type: "success" | "error" | "info" = "error",
  ) => {
    setAlertConfig({
      visible: true,
      title,
      message: msg,
      type,
    });
  };
  // Form States
  const [customerName, setCustomerName] = useState("");
  const [cashAmount, setCashAmount] = useState("");

  const items = useProductsStore((state) => state.items);
  const fetchHistories = useTransactionStore((state) => state.fetchHistories);
  const addToCart = (product: any) => {
    setCart((prev: any) => {
      const existing = prev.find((item: any) => item.id === product.id);
      if (existing)
        return prev.map((item: any) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id: any, delta: any) => {
    setCart((prev: any) =>
      prev
        .map((item: any) =>
          item.id === id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item,
        )
        .filter((item: any) => item.qty > 0),
    );
  };

  const totalPrice = cart.reduce(
    (sum: any, item: any) => sum + item.price * item.qty,
    0,
  );
  const totalItem = cart.reduce((sum: any, item: any) => sum + item.qty, 0);

  // Kalkulasi Kembalian
  const changeAmount = Number(cashAmount) - totalPrice;
  const isPaymentValid = Number(cashAmount) >= totalPrice && totalPrice > 0;

  const handleFinishTransaction = async () => {
    try {
      const payloadItems = cart.map((item: any) => ({
        productId: item.id,
        quantity: item.qty,
      }));

      await checkout(payloadItems, Number(cashAmount), customerName);
      notify("Berhasil!", `Transaksi atas nama ${customerName}`, "success");

      setCart([]);
      setCustomerName("");
      setCashAmount("");
      setIsCheckoutVisible(false);
      setIsCartVisible(false);
      fetchHistories();
    } catch (error) {
      notify("Error!", `Terjadi Kesalahan`, "error");
    }
  };

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top }}>
      <View className="px-6 py-4 flex-row justify-between items-center">
        <Text className="text-3xl font-black text-gray-900">Keranjang</Text>
        <TouchableOpacity
          onPress={() => setIsCartVisible(true)}
          className="bg-gray-100 p-3 rounded-2xl relative"
        >
          <ShoppingBag size={24} color="#111827" />
          {totalItem > 0 && (
            <View className="absolute -top-1 -right-1 bg-lime-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
              <Text className="text-[10px] text-white font-bold">
                {totalItem}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => addToCart(item)}
            className="flex-1 m-2 bg-white border border-gray-100 p-4 rounded-[32px] shadow-sm"
          >
            <Text className="font-bold text-gray-800 text-base mb-1">
              {item.name}
            </Text>
            <Text className="font-black text-lime-600 text-sm">
              Rp {item.price.toLocaleString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="items-center justify-center mt-20">
            <ShoppingBag size={32} color="#E5E7EB" />
            <Text className="text-gray-400 mt-4 font-semibold text-lg">
              Produk Kosong
            </Text>
          </View>
        )}
      />

      {/* Floating Bar */}
      {totalItem > 0 && (
        <View className="absolute bottom-10 left-6 right-6 shadow-2xl shadow-lime-500/50">
          <TouchableOpacity
            onPress={() => setIsCartVisible(true)}
            className="bg-lime-400 flex-row items-center justify-between p-5 rounded-[28px]"
          >
            <Text className="text-white font-bold text-base">
              {totalItem} Item | Rp {totalPrice.toLocaleString()}
            </Text>
            <ChevronRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}

      {/* --- MODAL 1: KERANJANG --- */}
      <Modal visible={isCartVisible} animationType="slide" transparent={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-[40px] h-[80%]">
            <View className="px-8 pt-10 flex-row justify-between items-center mb-6">
              <Text className="text-2xl font-black text-gray-900">
                Keranjang
              </Text>
              <TouchableOpacity onPress={() => setIsCartVisible(false)}>
                <X size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView className="px-8">
              {cart.length !== 0 ? (
                cart.map((item: any) => (
                  <View key={item.id} className="flex-row items-center mb-6">
                    <View className="flex-1">
                      <Text className="font-bold text-gray-800">
                        {item.name}
                      </Text>
                      <Text className="text-gray-400 text-sm">
                        Rp {item.price.toLocaleString()}
                      </Text>
                    </View>
                    <View className="flex-row items-center bg-gray-100 rounded-2xl p-1">
                      <TouchableOpacity
                        onPress={() => updateQty(item.id, -1)}
                        className="bg-white p-2 rounded-xl"
                      >
                        <Minus size={16} color="#374151" />
                      </TouchableOpacity>
                      <Text className="mx-4 font-black text-gray-900">
                        {item.qty}
                      </Text>
                      <TouchableOpacity
                        onPress={() => updateQty(item.id, 1)}
                        className="bg-gray-900 p-2 rounded-xl"
                      >
                        <Plus size={16} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center justify-center mt-20">
                  <ShoppingBag size={32} color="#E5E7EB" />
                  <Text className="text-gray-400 mt-4 font-semibold text-lg">
                    Keranjang Kosong
                  </Text>
                </View>
              )}
            </ScrollView>
            <View
              className="px-8 py-6 border-t border-gray-50"
              style={{ paddingBottom: insets.bottom + 20 }}
            >
              {cart.length === 0 ? (
                <TouchableOpacity
                  onPress={() => setIsCartVisible(false)}
                  className="bg-slate-400 h-16 rounded-[24px] items-center justify-center"
                >
                  <Text className="text-white font-bold text-md">
                    Tidak ada Produk
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsCheckoutVisible(true)}
                  className="bg-gray-900 h-16 rounded-[24px] items-center justify-center"
                >
                  <Text className="text-white font-bold text-lg">
                    Lanjut Pembayaran
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* --- MODAL 2: CHECKOUT & PEMBAYARAN --- */}
      <Modal
        visible={isCheckoutVisible}
        animationType="fade"
        transparent={true}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <View className="flex-1 bg-black/60 justify-center px-6">
            <View className="bg-white rounded-[40px] p-8">
              <View className="items-center mb-6">
                <Text className="text-xl font-black text-gray-900">
                  Detail Pembayaran
                </Text>
                <View className="bg-gray-100 px-4 py-2 rounded-full mt-2">
                  <Text className="text-gray-500 font-bold text-xs uppercase tracking-widest">
                    Total Tagihan
                  </Text>
                </View>
                <Text className="text-3xl font-black text-lime-600 mt-1">
                  Rp {totalPrice.toLocaleString()}
                </Text>
              </View>

              <View className="gap-y-4">
                {/* Input Nama */}
                <View>
                  <View className="flex-row items-center mb-2 ml-1">
                    <User size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 font-bold text-[10px] uppercase ml-1">
                      Nama Customer
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-800 font-bold"
                    placeholder="Contoh: Budi Santoso"
                    value={customerName}
                    onChangeText={setCustomerName}
                  />
                </View>

                {/* Input Uang Tunai */}
                <View>
                  <View className="flex-row items-center mb-2 ml-1">
                    <Wallet size={14} color="#9CA3AF" />
                    <Text className="text-gray-500 font-bold text-[10px] uppercase ml-1">
                      Uang Tunai (Cash)
                    </Text>
                  </View>
                  <TextInput
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 text-gray-800 font-black text-xl"
                    placeholder="Rp 0"
                    keyboardType="numeric"
                    value={cashAmount}
                    onChangeText={(txt) => setCashAmount(txt)}
                  />
                </View>

                {/* Info Kembalian */}
                <View className="bg-gray-50 p-5 rounded-3xl border border-dashed border-gray-200">
                  <Text className="text-gray-400 font-bold text-center text-[10px] uppercase">
                    Kembalian
                  </Text>
                  <Text
                    className={`text-center text-2xl font-black mt-1 ${changeAmount < 0 ? "text-red-400" : "text-gray-900"}`}
                  >
                    Rp {changeAmount < 0 ? "0" : changeAmount.toLocaleString()}
                  </Text>
                  {changeAmount < 0 && (
                    <Text className="text-red-400 text-[10px] text-center font-bold mt-1 italic">
                      * Uang belum cukup
                    </Text>
                  )}
                </View>
              </View>

              {/* Action Buttons */}
              <View className="flex-row gap-3 mt-8">
                <TouchableOpacity
                  onPress={() => setIsCheckoutVisible(false)}
                  className="flex-1 bg-gray-100 h-14 rounded-2xl items-center justify-center"
                >
                  <Text className="text-gray-500 font-bold">Batal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleFinishTransaction}
                  disabled={!isPaymentValid || isLoading}
                  className={`flex-[2] h-14 rounded-2xl flex-row items-center justify-center ${
                    isPaymentValid && !isLoading ? "bg-lime-400" : "bg-gray-200"
                  }`}
                >
                  <Text className="text-white font-black ml-2">Selesaikan</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      <CustomAlert
        visible={alertConfig.visible}
        type={alertConfig.type}
        title={alertConfig.title}
        message={alertConfig.message}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </View>
  );
};

export default TransactionPage;
