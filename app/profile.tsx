import useAuthStore from "@/store/useAuthStore";
import { useFocusEffect } from "expo-router";
import {
    ChevronLeft,
    LogOut,
    MapPin,
    Phone,
    Save,
    ShieldCheck,
    User,
    X,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileModal = ({ visible, onClose }: any) => {
  const insets = useSafeAreaInsets();
  const { profile, fetchProfile, clearProfile, loading, updateProfile } =
    useAuthStore();

  // State untuk mode edit
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  // Sinkronisasi data store ke form lokal saat modal buka atau profile berubah
  useEffect(() => {
    if (profile) {
      setForm({
        name: profile.name || "",
        phone: profile.phone || "",
        address: profile.address || "",
      });
    }
  }, [profile, visible]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const handleSave = async () => {
    try {
      // Asumsi updateProfile menerima object form
      await updateProfile(form);
      setIsEditing(false);
    } catch (error) {
      console.error("Gagal update profile", error);
    }
  };

  const handleLogout = async () => {
    try {
      clearProfile();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 justify-end">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <View
          className="bg-white rounded-t-[40px] shadow-2xl"
          style={{
            paddingBottom: insets.bottom + 20,
            maxHeight: "90%",
          }}
        >
          {/* Handle Bar */}
          <View className="items-center pt-4 pb-2">
            <View className="w-16 h-1.5 bg-gray-200 rounded-full" />
          </View>

          {/* Header Dinamis */}
          <View className="flex-row justify-between items-center px-8 mb-6">
            {isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(false)}
                className="flex-row items-center"
              >
                <ChevronLeft size={24} color="#111827" />
                <Text className="text-xl font-black text-gray-900 ml-2">
                  Edit Profil
                </Text>
              </TouchableOpacity>
            ) : (
              <Text className="text-2xl font-black text-gray-900">
                Profil Saya
              </Text>
            )}

            {!isEditing && (
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-100 p-2 rounded-full"
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
            {/* Avatar Section */}
            <View className="items-center mb-8">
              <View className="w-24 h-24 bg-lime-100 rounded-[32px] items-center justify-center border-4 border-lime-50 mb-4">
                <User size={48} color="#65a30d" />
              </View>
              {!isEditing && (
                <>
                  <Text className="text-xl font-bold text-gray-900">
                    {profile?.name}
                  </Text>
                  <View className="bg-gray-100 px-3 py-1 rounded-full mt-1 flex-row items-center">
                    <ShieldCheck size={12} color="#6b7280" />
                    <Text className="text-[10px] font-bold text-gray-500 uppercase ml-1">
                      Administrator
                    </Text>
                  </View>
                </>
              )}
            </View>

            {isEditing ? (
              /* FORM EDIT */
              <View className="gap-y-5 mb-8">
                <View>
                  <Text className="text-gray-500 text-xs font-bold mb-2 ml-1">
                    Nama Lengkap
                  </Text>
                  <TextInput
                    className="bg-gray-50 p-4 rounded-2xl border border-gray-100 font-bold"
                    value={form.name}
                    onChangeText={(txt) => setForm({ ...form, name: txt })}
                    placeholder="Masukkan nama..."
                  />
                </View>

                <View>
                  <Text className="text-gray-500 text-xs font-bold mb-2 ml-1">
                    Nomor Telepon
                  </Text>
                  <View className="flex-row items-center bg-gray-50 rounded-2xl border border-gray-100 px-4">
                    <Phone size={18} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 p-4 font-bold text-gray-700"
                      value={form.phone}
                      onChangeText={(txt) => setForm({ ...form, phone: txt })}
                      placeholder="0812xxxx"
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>

                <View>
                  <Text className="text-gray-500 text-xs font-bold mb-2 ml-1">
                    Alamat Kedai
                  </Text>
                  <View className="flex-row items-start bg-gray-50 rounded-2xl border border-gray-100 px-4 pt-4">
                    <MapPin size={18} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 px-4 pb-4 font-bold text-gray-700"
                      value={form.address}
                      onChangeText={(txt) => setForm({ ...form, address: txt })}
                      placeholder="Jl. Raya Nomor 10..."
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSave}
                  disabled={loading}
                  className="bg-lime-400 p-5 rounded-[24px] flex-row items-center justify-center shadow-lg shadow-lime-200"
                >
                  {loading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <>
                      <Save size={20} color="#064e3b" />
                      <Text className="text-lime-950 font-black ml-2 text-lg">
                        Simpan Perubahan
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* VIEW PROFILE */
              <View className="gap-y-6">
                <View className="bg-gray-50 p-6 rounded-[32px] border border-gray-100">
                  <View className="mb-4">
                    <Text className="text-gray-400 text-[10px] font-black uppercase">
                      Telepon
                    </Text>
                    <Text className="text-gray-800 font-bold text-base">
                      {profile?.phone || "Belum ada"}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-400 text-[10px] font-black uppercase">
                      Alamat
                    </Text>
                    <Text className="text-gray-800 font-bold text-base">
                      {profile?.address || "Belum ada"}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={() => setIsEditing(true)}
                  className="bg-gray-900 p-5 rounded-[24px] flex-row items-center justify-center"
                >
                  <Text className="text-white font-bold text-lg">
                    Edit Profil
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleLogout}
                  className="bg-red-50 p-5 rounded-[24px] flex-row items-center justify-center border border-red-100 mb-6"
                >
                  <LogOut size={20} color="#ef4444" />
                  <Text className="text-red-500 font-bold ml-2">
                    Keluar Aplikasi
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ProfileModal;
