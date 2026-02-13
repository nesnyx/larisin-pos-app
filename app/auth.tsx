import { ENDPOINTS } from '@/constants/endpoints';
import useUserStore from '@/store/useAuthStore';
import api from '@/utils/api';
import { useRouter } from 'expo-router';
import * as SecureStore from "expo-secure-store";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const AuthPage = () => {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const fetchProfile = useUserStore((state) => state.fetchProfile);

    const [isLogin, setIsLogin] = useState(true);
    const [secureText, setSecureText] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    // Helper untuk Alert agar seragam
    const notify = (title: string, msg: string) => {
        Alert.alert(title, msg, [{ text: "Siap!" }]);
    };

    const handleAuth = async () => {
        const { email, password, name, confirmPassword } = formData;

        // Validasi Sederhana
        if (!email || !password) return notify("Waduh!", "Email & Password jangan kosong ya!");
        if (!isLogin && (!name || !confirmPassword)) return notify("Data Kurang", "Semua kolom harus diisi!");
        if (!isLogin && password !== confirmPassword) return notify("Gak Cocok!", "Password konfirmasi beda nih.");

        setLoading(true);
        try {
            if (isLogin) {
                // LOGIC LOGIN
                const response = await api.post(ENDPOINTS.AUTH.LOGIN, {
                    email: formData.email.toLowerCase().trim(),
                    password: formData.password,

                });

                if (response.data.data.token) {
                    await SecureStore.setItemAsync("userToken", response.data.data.token);
                    await useUserStore.getState().fetchProfile();
                    router.replace("/(tabs)");
                }
            } else {
                await api.post(ENDPOINTS.AUTH.REGISTER, {
                    email: email.toLowerCase().trim(),
                    password: password,
                    name: name,
                });
                notify("Berhasil!", "Akun dibuat. Silakan login untuk verifikasi.");
                setIsLogin(true);
                setFormData({ ...formData, password: '', confirmPassword: '' });
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Terjadi kesalahan sistem.";
            notify(isLogin ? "Login Gagal" : "Gagal Daftar", Array.isArray(msg) ? msg[0] : msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAwareScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            enableOnAndroid={true}
            extraScrollHeight={20} 
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}>
                <View
                    className="bg-lime-400 rounded-b-[50px] px-8 pb-16 shadow-2xl shadow-lime-200"
                    style={{ paddingTop: insets.top + 40 }}
                >
                    <View className="bg-white w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-sm">
                        <ShieldCheck size={32} color="#111827" />
                    </View>
                    <Text className="text-white text-4xl font-black italic">
                        {isLogin ? 'Selamat\nDatang Kembali' : 'Buat Akun\nBaru Anda'}
                    </Text>
                </View>

                {/* Form */}
                <View className="px-8 mt-10">
                    <View className="gap-y-4">
                        {!isLogin && (
                            <InputField
                                label="Nama Lengkap"
                                icon={<User size={18} color="#9CA3AF" />}
                                placeholder="Tulis namamu..."
                                value={formData.name}
                                onChangeText={(txt: any) => setFormData({ ...formData, name: txt })}
                            />
                        )}

                        <InputField
                            label="Email Address"
                            icon={<Mail size={18} color="#9CA3AF" />}
                            placeholder="Masukan Email"
                            keyboardType="email-address"
                            value={formData.email}
                            onChangeText={(txt: any) => setFormData({ ...formData, email: txt })}
                        />

                        <InputField
                            label="Password"
                            icon={<Lock size={18} color="#9CA3AF" />}
                            placeholder="Masukan Password"
                            secureTextEntry={secureText}
                            value={formData.password}
                            onChangeText={(txt: any) => setFormData({ ...formData, password: txt })}
                            rightIcon={
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    {secureText ? <Eye size={18} color="#9CA3AF" /> : <EyeOff size={18} color="#9CA3AF" />}
                                </TouchableOpacity>
                            }
                        />

                        {!isLogin && (
                            <InputField
                                label="Konfirmasi Password"
                                icon={<Lock size={18} color="#9CA3AF" />}
                                placeholder="••••••••"
                                secureTextEntry={secureText}
                                value={formData.confirmPassword}
                                onChangeText={(txt: any) => setFormData({ ...formData, confirmPassword: txt })}
                            />
                        )}
                    </View>

                    {/* Submit */}
                    <TouchableOpacity
                        onPress={handleAuth}
                        disabled={loading}
                        className={`bg-gray-900 h-16 rounded-2xl flex-row items-center justify-center mt-10 ${loading ? 'opacity-70' : ''}`}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <>
                                <Text className="text-white font-black text-lg mr-2">
                                    {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                                </Text>
                                <ArrowRight size={20} color="white" />
                            </>
                        )}
                    </TouchableOpacity>

                    {/* Switcher */}
                    <TouchableOpacity
                        onPress={() => setIsLogin(!isLogin)}
                        className="flex-row justify-center mt-8 pb-10"
                    >
                        <Text className="text-gray-400 font-medium">
                            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                        </Text>
                        <Text className="text-lime-600 font-black">
                            {isLogin ? 'Daftar' : 'Masuk'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAwareScrollView>
    );
};

// Komponen Reusable agar code tidak berulang (DRY)
const InputField = ({ label, icon, rightIcon, ...props }: any) => (
    <View>
        <Text className="text-gray-400 font-bold text-[10px] uppercase ml-1 mb-2">{label}</Text>
        <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 focus:border-lime-400">
            {icon}
            <TextInput className="flex-1 py-4 ml-3 text-gray-800 font-medium" {...props} />
            {rightIcon}
        </View>
    </View>
);

export default AuthPage;