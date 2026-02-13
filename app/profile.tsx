import useAuthStore from '@/store/useAuthStore';
import { router, useFocusEffect } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
    LockIcon,
    LogOut,
    Package,
    Settings,
    ShieldCheck,
    User,
    X
} from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
    Modal,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ProfileModal = ({ visible, onClose }: any) => {
    const insets = useSafeAreaInsets();
    const { profile, fetchProfile } = useAuthStore()
    useFocusEffect(
        useCallback(() => {
            fetchProfile()
            return () => { };
        }, []),
    );
    const handleLogout = async () => {
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem('userToken');
            } else {
                await SecureStore.deleteItemAsync('userToken');
            }
            onClose();
            router.replace('/auth');
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
            {/* Backdrop dengan warna solid agar tidak tembus ke background kotor */}
            <View className="flex-1 bg-black/60 justify-end">

                {/* Area tutup modal jika klik di luar */}
                <TouchableOpacity
                    className="flex-1"
                    activeOpacity={1}
                    onPress={onClose}
                />

                <View
                    className="bg-white rounded-t-[40px] shadow-2xl"
                    style={{
                        paddingBottom: insets.bottom + 20,
                        maxHeight: '85%'
                    }}
                >
                    {/* Handle Bar */}
                    <View className="items-center pt-4 pb-2">
                        <View className="w-16 h-1.5 bg-gray-200 rounded-full" />
                    </View>

                    {/* Header */}
                    <View className="flex-row justify-between items-center px-8 mb-6">
                        <Text className="text-2xl font-black text-gray-900">Profil Saya</Text>
                        <TouchableOpacity
                            onPress={onClose}
                            className="bg-gray-100 p-2 rounded-full"
                        >
                            <X size={20} color="#374151" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView className="px-8" showsVerticalScrollIndicator={false}>
                        {/* Avatar & Info Utama */}
                        <View className="items-center mb-8">
                            <View className="w-24 h-24 bg-lime-100 rounded-[32px] items-center justify-center border-4 border-lime-50 mb-4">
                                <User size={48} color="#65a30d" />
                            </View>
                            <Text className="text-xl font-bold text-gray-900">{profile?.name}</Text>
                            <View className="bg-gray-100 px-3 py-1 rounded-full mt-1 flex-row items-center">
                                <ShieldCheck size={12} color="#6b7280" />
                                <Text className="text-[10px] font-bold text-gray-500 uppercase ml-1">Administrator</Text>
                            </View>
                        </View>



                        {/* Menu List */}
                        <View className="gap-y-3 mb-8">
                            <Text className="text-gray-400 text-[10px] font-black uppercase ml-1">Pengaturan</Text>

                            <TouchableOpacity disabled={true} className="flex-row items-center bg-gray-200 border border-gray-100 p-4 rounded-2xl">
                                <View className="bg-blue-50 p-2 rounded-xl mr-4">
                                    <Settings size={20} color="#3b82f6" />
                                </View>
                                <Text className="flex-1 font-bold text-gray-700">Pengaturan Akun</Text>
                                <LockIcon size={23} color="#ffff" />
                            </TouchableOpacity>

                            <TouchableOpacity disabled={true} className="flex-row items-center bg-gray-200 border border-gray-100 p-4 rounded-2xl">
                                <View className="bg-purple-50 p-2 rounded-xl mr-4">
                                    <Package size={20} color="#a855f7" />
                                </View>
                                <Text className="flex-1 font-bold text-gray-700">Riwayat Aktivitas</Text>
                                <LockIcon size={23} color="#ffff" />
                            </TouchableOpacity>
                        </View>

                        {/* Logout Button */}
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-50 p-5 rounded-[24px] flex-row items-center justify-center border border-red-100 mb-6"
                        >
                            <LogOut size={20} color="#ef4444" />
                            <Text className="text-red-500 font-bold ml-2">Keluar Aplikasi</Text>
                        </TouchableOpacity>

                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default ProfileModal;