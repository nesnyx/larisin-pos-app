import { Barcode, Edit3, Minus, Plus, Trash2, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Image, Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProductDetailModal = ({ visible, onClose, product } : any) => {
  const insets = useSafeAreaInsets();
  const [tempStock, setTempStock] = useState(product?.stock || 0);

  if (!product) return null;

  // Hitung Margin Keuntungan
  const margin = product.sellingPrice - product.costPrice;
  const marginPercentage = ((margin / product.costPrice) * 100).toFixed(1);

  return (
    <Modal animationType="slide" visible={visible} transparent={true}>
      <View className="flex-1 bg-black/50 justify-end">
        <View 
          className="bg-white rounded-t-[40px]" 
          style={{ paddingBottom: insets.bottom + 20, paddingTop: 20 }}
        >
          {/* Header Modal */}
          <View className="flex-row justify-between items-center px-8 mb-6">
            <Text className="text-xl font-black text-gray-900">Detail Produk</Text>
            <TouchableOpacity onPress={onClose} className="bg-gray-100 p-2 rounded-full">
              <X size={20} color="#374151" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
            {/* Bagian Atas: Gambar & Nama */}
            <View className="flex-row items-center mb-8">
              <Image source={{ uri: product.image }} className="w-24 h-24 rounded-[24px] bg-gray-100" />
              <View className="ml-5 flex-1">
                <View className="bg-lime-100 self-start px-3 py-1 rounded-full mb-1">
                  <Text className="text-[10px] font-bold text-lime-700 uppercase">{product.category}</Text>
                </View>
                <Text className="text-2xl font-bold text-gray-800 leading-7">{product.name}</Text>
                <Text className="text-gray-400 text-sm mt-1 flex-row items-center">
                  <Barcode size={14} color="#9CA3AF" /> {product.sku || 'No SKU'}
                </Text>
              </View>
            </View>

            {/* Insight Keuntungan (Fitur Menjual) */}
            <View className="bg-gray-50 p-5 rounded-[24px] mb-8 border border-gray-100 flex-row justify-between">
              <View>
                <Text className="text-gray-400 text-xs font-bold uppercase tracking-widest">Harga Beli</Text>
                <Text className="text-lg font-bold text-gray-800">Rp {product.costPrice.toLocaleString()}</Text>
              </View>
              <View className="items-end">
                <Text className="text-lime-600 text-xs font-bold uppercase tracking-widest">Estimasi Laba</Text>
                <Text className="text-lg font-bold text-lime-600">+Rp {margin.toLocaleString()} ({marginPercentage}%)</Text>
              </View>
            </View>

            {/* Manajemen Stok Cepat */}
            <Text className="text-gray-900 font-bold mb-4 text-lg">Manajemen Stok</Text>
            <View className="flex-row items-center justify-between bg-white border border-gray-100 p-4 rounded-[24px] shadow-sm mb-8">
              <TouchableOpacity 
                onPress={() => setTempStock(Math.max(0, tempStock - 1))}
                className="bg-gray-100 w-12 h-12 rounded-2xl items-center justify-center"
              >
                <Minus size={24} color="#374151" />
              </TouchableOpacity>
              
              <View className="items-center">
                <Text className="text-3xl font-black text-gray-900">{tempStock}</Text>
                <Text className="text-gray-400 text-xs font-bold">Stok Saat Ini</Text>
              </View>

              <TouchableOpacity 
                onPress={() => setTempStock(tempStock + 1)}
                className="bg-lime-400 w-12 h-12 rounded-2xl items-center justify-center shadow-md shadow-lime-400/40"
              >
                <Plus size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Tombol Aksi */}
            <View className="flex-row gap-4 mb-4">
              <TouchableOpacity className="flex-1 bg-gray-900 h-16 rounded-[24px] flex-row items-center justify-center">
                <Edit3 size={20} color="white" />
                <Text className="text-white font-bold ml-2 text-base">Edit Produk</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="bg-red-50 w-16 h-16 rounded-[24px] items-center justify-center border border-red-100">
                <Trash2 size={24} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProductDetailModal;