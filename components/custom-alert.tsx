 import { CheckCircle2, Info, XCircle } from 'lucide-react-native';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface CustomAlertProps {
    visible: boolean;
    type: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose: () => void;
}

const CustomAlert = ({ visible, type, title, message, onClose }: CustomAlertProps) => {
    // Konfigurasi berdasarkan tipe
    const config = {
        success: {
            icon: <CheckCircle2 size={40} color="#84cc16" />, // lime-500
            bgColor: 'bg-lime-50',
            buttonColor: 'bg-lime-500',
        },
        error: {
            icon: <XCircle size={40} color="#ef4444" />, // red-500
            bgColor: 'bg-red-50',
            buttonColor: 'bg-red-500',
        },
        info: {
            icon: <Info size={40} color="#3b82f6" />, // blue-500
            bgColor: 'bg-blue-50',
            buttonColor: 'bg-blue-500',
        },
    };

    const currentConfig = config[type];

    return (
        <Modal transparent visible={visible} animationType="fade">
            <View className="flex-1 justify-center items-center bg-black/50 px-6">
                <View className="bg-white w-full rounded-[30px] p-6 items-center shadow-xl">
                    {/* Icon Container */}
                    <View className={`${currentConfig.bgColor} p-4 rounded-full mb-4`}>
                        {currentConfig.icon}
                    </View>

                    {/* Text Content */}
                    <Text className="text-gray-900 text-xl font-black mb-2 text-center">
                        {title}
                    </Text>
                    <Text className="text-gray-500 text-base font-medium text-center mb-6">
                        {message}
                    </Text>

                    {/* Action Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        className={`${currentConfig.buttonColor} w-full py-4 rounded-2xl shadow-lg shadow-gray-300`}
                    >
                        <Text className="text-white text-center font-bold text-lg">Siap!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;