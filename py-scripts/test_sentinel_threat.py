import requests
import time
import json

# Java Backend URL (Packet Receiver Controller)
URL = "http://localhost:8082/api/packets/simulate"

def send_test_threat():
    # AbuseIPDB skoru genellikle yüksek olan gerçek bir IP
    malicious_ip = "185.220.101.10" 
    
    payload = {
        "src": malicious_ip,
        "dst": "192.168.1.50",
        "reason": "AI Intelligence - External Feed Analysis",
        "size": 1024
    }

    print(f"🚀 Sentinel'e test paketi gönderiliyor: {malicious_ip}")
    
    try:
        response = requests.post(URL, json=payload)
        if response.status_code == 200:
            print("✅ Paket başarıyla gönderildi!")
            print("💡 Dashboard'u kontrol et: Haritada yerini almalı ve kırmızı yanmalı.")
        else:
            print(f"❌ Hata oluştu: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"📡 Bağlantı hatası (Backend açık mı?): {e}")

if __name__ == "__main__":
    send_test_threat()