import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AuthPage = () => {
    const insets = useSafeAreaInsets();
    const [isLogin, setIsLogin] = useState(true);
    const [secureText, setSecureText] = useState(true);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: ''
    });

    const handleAuth = () => {
        console.log("Submit Data:", formData);
        // Logic login/register di sini
    };

    return (
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
            className="flex-1 bg-white"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section dengan Background Aksen */}
                <View 
                    className="bg-lime-400 rounded-b-[50px] px-8 pt-20 pb-16 shadow-2xl shadow-lime-200"
                    style={{ paddingTop: insets.top + 40 }}
                >
                    <View className="bg-white w-16 h-16 rounded-2xl items-center justify-center mb-6 shadow-sm">
                        <View className="bg-gray-900 w-8 h-8 rounded-lg" />
                    </View>
                    <Text className="text-white text-4xl font-black">
                        {isLogin ? 'Selamat\nDatang Kembali' : 'Buat Akun\nBaru Anda'}
                    </Text>
                    <Text className="text-gray-900/50 font-medium mt-2">
                        {isLogin ? 'Kelola inventaris jadi lebih mudah.' : 'Mulai kelola bisnis Anda sekarang.'}
                    </Text>
                </View>

                {/* Form Section */}
                <View className="px-8 mt-10">
                    <View className="gap-y-5">
                        {!isLogin && (
                            <View>
                                <Text className="text-gray-400 font-bold text-[10px] uppercase ml-1 mb-2">Nama Lengkap</Text>
                                <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100 focus:border-lime-400">
                                    <TextInput 
                                        className="flex-1 py-4 text-gray-800 font-medium"
                                        placeholder="Tulis namamu..."
                                        value={formData.name}
                                        onChangeText={(txt) => setFormData({...formData, name: txt})}
                                    />
                                </View>
                            </View>
                        )}

                        <View>
                            <Text className="text-gray-400 font-bold text-[10px] uppercase ml-1 mb-2">Email Address</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                <Mail size={18} color="#9CA3AF" />
                                <TextInput 
                                    className="flex-1 py-4 ml-3 text-gray-800 font-medium"
                                    placeholder="email@bisnis.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={formData.email}
                                    onChangeText={(txt) => setFormData({...formData, email: txt})}
                                />
                            </View>
                        </View>

                        <View>
                            <Text className="text-gray-400 font-bold text-[10px] uppercase ml-1 mb-2">Password</Text>
                            <View className="flex-row items-center bg-gray-50 rounded-2xl px-4 border border-gray-100">
                                <Lock size={18} color="#9CA3AF" />
                                <TextInput 
                                    className="flex-1 py-4 ml-3 text-gray-800 font-medium"
                                    placeholder="••••••••"
                                    secureTextEntry={secureText}
                                    value={formData.password}
                                    onChangeText={(txt) => setFormData({...formData, password: txt})}
                                />
                                <TouchableOpacity onPress={() => setSecureText(!secureText)}>
                                    {secureText ? <Eye size={18} color="#9CA3AF" /> : <EyeOff size={18} color="#9CA3AF" />}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {isLogin && (
                            <TouchableOpacity className="self-end">
                                <Text className="text-gray-400 text-xs font-bold">Lupa Password?</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity 
                        onPress={handleAuth}
                        activeOpacity={0.8}
                        className="bg-gray-900 h-16 rounded-2xl flex-row items-center justify-center mt-10 shadow-xl shadow-black/20"
                    >
                        <Text className="text-white font-black text-lg mr-2">
                            {isLogin ? 'Masuk' : 'Daftar Sekarang'}
                        </Text>
                        <ArrowRight size={20} color="white" />
                    </TouchableOpacity>

                    {/* Toggle Login/Register */}
                    <View className="flex-row justify-center mt-8 pb-10">
                        <Text className="text-gray-400 font-medium">
                            {isLogin ? 'Belum punya akun? ' : 'Sudah punya akun? '}
                        </Text>
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
                            <Text className="text-lime-600 font-black">
                                {isLogin ? 'Daftar' : 'Masuk'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AuthPage;