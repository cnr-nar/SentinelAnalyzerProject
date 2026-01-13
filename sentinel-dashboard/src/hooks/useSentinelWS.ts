"use client";
import { useEffect, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

// Java'dan gelecek veri yapısı
export interface Alert {
  src: string;
  dst: string;
  reason: string;
}

export const useSentinelWS = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]); // 'messages' yerine 'alerts'
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new SockJS('http://localhost:8083/sentinel-ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        setIsConnected(true);
        client.subscribe('/topic/alerts', (message) => {
          if (message.body) {
            try {
              const newAlert: Alert = JSON.parse(message.body);
              setAlerts((prev) => [newAlert, ...prev].slice(0, 20));
            } catch (e) {
              console.error("JSON Parse Error:", e);
            }
          }
        });
      },
      onDisconnect: () => setIsConnected(false),
    });

    client.activate();
    return () => { if (client.active) client.deactivate(); };
  }, []);

  return { alerts, isConnected }; // Burada 'alerts' döndüğümüzden emin oluyoruz
};