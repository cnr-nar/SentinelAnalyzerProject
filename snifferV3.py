# test_attack.py
from confluent_kafka import Producer
import json
import time

p = Producer({'bootstrap.servers': 'localhost:9092'})

# Tek bir IP'den 30 farklı "hedef:port" kombinasyonuna paket gönderiyormuş gibi yap
for i in range(30):
    data = {
        "src": "192.168.1.50",
        "dst": f"10.0.0.{i}", # Farklı hedefler
        "proto": 6,
        "len": 64
    }
    p.produce('raw-traffic', json.dumps(data).encode('utf-8'))
    time.sleep(0.1)

p.flush()
print("Attack simulation finished.")