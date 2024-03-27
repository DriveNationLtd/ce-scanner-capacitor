import { useEffect, useState } from "react";
import { Network } from '@capacitor/network';

export const useConnectiviy = () => {
    const [isOnline, setIsOnline] = useState<boolean>(
        typeof window !== 'undefined' ? window.navigator.onLine : true
    );

    const currentNetworkStatus = async () => {
        const status = await Network.getStatus();
        setIsOnline(status.connected);
    };

    useEffect(() => {
        currentNetworkStatus();

        Network.addListener('networkStatusChange', status => {
            setIsOnline(status.connected);
        });

        return () => {
            Network.removeAllListeners();
        };

    }, []);

    return {
        isOnline
    }
}