"use client";
import { useEffect, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export interface Alert {
  src: string;
  dst: string;
  reason: string;
  country?: string;
  city?: string;
}

export const useSentinelWS = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
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
              setAlerts((prev) => [newAlert, ...prev].slice(0, 50));
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

  return { alerts, isConnected };
};

export const useSentinelFirewall = () => {
  const [bannedIPs, setBannedIPs] = useState<string[]>([]);

  const fetchBannedIPs = useCallback(async (isMounted: boolean) => {
    try {
      const res = await fetch('http://localhost:8083/api/firewall/banned');
      if (res.ok) {
        const data = await res.json();
        if (isMounted) setBannedIPs(data);
      }
    } catch (e) {
      console.error("Firewall API error:", e);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // HATANIN ÇÖZÜMÜ: Fonksiyonu senkron bir void çağrısı içine alıyoruz.
    // Bu sayede React, asenkron akışın kontrolünü devralır.
    const loadInitialData = () => {
      void fetchBannedIPs(isMounted);
    };

    loadInitialData();

    const interval = setInterval(() => {
      void fetchBannedIPs(isMounted);
    }, 5000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchBannedIPs]); 

  const unblockIP = async (ip: string) => {
    try {
      await fetch(`http://localhost:8083/api/firewall/unblock/${ip}`, { method: 'DELETE' });
      void fetchBannedIPs(true);
    } catch (e) {
       console.error("Unblock error:", e);
    }
  };

  return { bannedIPs, unblockIP };
};