import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export const useCheckInternet = (): boolean => {
  const [isOnline, setIsOnline] = useState<boolean>(true);

  useEffect(() => {
    // 1. Monitor perubahan status network dari OS
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected === false) {
        setIsOnline(false);
      }
    });

    // 2. Polling Realtime (Check ketersediaan internet sebenarnya)
    const checkConnection = async () => {
      try {
        // HEAD request ke google atau server kamu sendiri
        const response = await fetch('https://8.8.8.8', {
          method: 'HEAD',
          cache: 'no-cache',
        });
        
        setIsOnline(response.ok || response.status === 200 || response.type === 'opaque');
      } catch (error) {
        setIsOnline(false);
      }
    };

    // Jalankan polling setiap 3 detik
    const interval = setInterval(checkConnection, 3000);

    // Initial check
    checkConnection();

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return isOnline;
};