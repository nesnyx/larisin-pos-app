import { useProductsStore } from '@/store/useProductsStore';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Minus, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { ActivityIndicator, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductDetailModal = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params: any = useLocalSearchParams();
  const { deleteProduct, updateProduct } = useProductsStore()
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tempStock, setTempStock] = useState(Number(params.stock) || 0);
  const [editData, setEditData] = useState({
    name: params.name,
    price: params.price.toString(),
    category: params.category
  });

  const handleSave =  async () => {
    const finalData = { ...editData, stock: tempStock };
    console.log("Saving data:", finalData);
    setLoading(true);
    try {
      await updateProduct(params.id,Number(finalData.price),finalData.name,finalData.category,finalData.stock)
    } catch (error) {
      console.error("Update error:", error);
      alert("Gagal update produk");
    } finally {
      setIsEditing(false);
      router.back();
    }

  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProduct(params.id)
      setShowDeleteConfirm(false);
      router.back();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Gagal menghapus produk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <Modal animationType="slide" transparent={true} visible={true}>
        <View className="flex-1 bg-black/50 justify-end">
          <View
            className="bg-white rounded-t-[40px]"
            style={{ paddingBottom: insets.bottom + 20, paddingTop: 20 }}
          >
            {/* Header */}
            <View className="flex-row justify-between items-center px-8 mb-6">
              <Text className="text-xl font-black text-gray-900">
                {isEditing ? "Edit Produk" : "Detail Produk"}
              </Text>
              <TouchableOpacity onPress={() => isEditing ? setIsEditing(false) : router.back()} className="bg-gray-100 p-2 rounded-full">
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
              {isEditing ? (
                /* --- TAMPILAN FORM EDIT --- */
                <View className="gap-y-4">
                  <View>
                    <Text className="text-gray-500 mb-2 font-bold">Nama Produk</Text>
                    <TextInput
                      className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-800"
                      value={editData.name}
                      onChangeText={(txt) => setEditData({ ...editData, name: txt })}
                    />
                  </View>
                  <View>
                    <Text className="text-gray-500 mb-2 font-bold">Harga Jual (Rp)</Text>
                    <TextInput
                      className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-gray-800"
                      keyboardType="numeric"
                      value={editData.price}
                      onChangeText={(txt) => setEditData({ ...editData, price: txt })}
                    />
                  </View>
                </View>
              ) : (
                /* --- TAMPILAN DETAIL --- */
                <View>
                  <View className="flex-row items-center mb-8">
                    <View className="flex-1">
                      <View className="bg-lime-100 self-start px-3 py-1 rounded-full mb-1">
                        <Text className="text-[10px] font-bold text-lime-700 uppercase">{params.category}</Text>
                      </View>
                      <Text className="text-2xl font-bold text-gray-800">{params.name}</Text>
                    </View>
                  </View>

                  <View className="bg-gray-50 p-5 rounded-[24px] mb-8 border border-gray-100 flex-row justify-between">
                    <View>
                      <Text className="text-gray-400 text-xs font-bold uppercase">Harga Jual</Text>
                      <Text className="text-lg font-bold text-gray-800">Rp {Number(editData.price).toLocaleString()}</Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Manajemen Stok */}
              <Text className="text-gray-900 font-bold mt-4 mb-4 text-lg">Manajemen Stok</Text>
              <View className="flex-row items-center justify-between bg-white border border-gray-100 p-4 rounded-[24px] shadow-sm mb-8">
                <TouchableOpacity
                  onPress={() => setTempStock(Math.max(0, tempStock - 1))}
                  className="bg-gray-100 w-12 h-12 rounded-2xl items-center justify-center"
                >
                  <Minus size={24} color="#374151" />
                </TouchableOpacity>
                <View className="items-center">
                  <Text className="text-3xl font-black text-gray-900">{tempStock}</Text>
                  <Text className="text-gray-400 text-xs font-bold">Stok</Text>
                </View>
                <TouchableOpacity
                  onPress={() => setTempStock(tempStock + 1)}
                  className="bg-lime-400 w-12 h-12 rounded-2xl items-center justify-center"
                >
                  <Plus size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Tombol Aksi */}
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={() => isEditing ? handleSave() : setIsEditing(true)}
                  className="flex-1 bg-gray-900 h-16 rounded-[24px] flex-row items-center justify-center"
                >
                  <Text className="text-white font-bold text-base">
                    {isEditing ? "Simpan Perubahan" : "Edit Produk"}
                  </Text>
                </TouchableOpacity>

                {!isEditing && (
                  <TouchableOpacity
                    onPress={() => setShowDeleteConfirm(true)}
                    className="bg-red-50 w-16 h-16 rounded-[24px] items-center justify-center border border-red-100"
                  >
                    <Trash2 size={24} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* --- MODAL KONFIRMASI HAPUS --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showDeleteConfirm}
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View className="flex-1 bg-black/60 justify-center items-center px-8">
          <View className="bg-white w-full rounded-[32px] p-8 items-center">
            <View className="bg-red-100 p-4 rounded-full mb-4">
              <Trash2 size={32} color="#EF4444" />
            </View>

            <Text className="text-xl font-black text-gray-900 mb-2">Hapus Produk?</Text>
            <Text className="text-gray-500 text-center mb-8 font-medium">
              Data produk <Text className="font-bold text-gray-800">"{params.name}"</Text> akan dihapus permanen dan tidak bisa dikembalikan.
            </Text>

            <View className="flex-row gap-x-3 w-full">
              <TouchableOpacity
                onPress={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-100 h-14 rounded-2xl items-center justify-center"
              >
                <Text className="text-gray-600 font-bold">Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDelete}
                disabled={loading}
                className="flex-1 bg-red-500 h-14 rounded-2xl items-center justify-center shadow-lg shadow-red-200"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white font-bold">Ya, Hapus</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ProductDetailModal;