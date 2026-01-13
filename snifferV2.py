from scapy.all import sniff, IP
from confluent_kafka import Producer
import json
import socket

# 1. Kafka Yapılandırmasını Yüksek Hız İçin Optimize Et
conf = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': socket.gethostname(),
    'linger.ms': 10,           # Mesajları toplu göndermek için küçük bir bekleme (Batching)
    'batch.size': 1000000,     # Byte cinsinden batch boyutu
    'compression.type': 'lz4', # CPU'yu az yoran hızlı sıkıştırma
    'queue.buffering.max.messages': 1000000 # Buffer kapasitesini artır
}

producer = Producer(conf)

# 2. Callback fonksiyonunu sadece hata durumunda çalışacak şekilde sadeleştir
def delivery_report(err, msg):
    if err is not None:
        print(f"Hata: {err}")

def process_and_send(packet):
    try:
        # Sadece IP katmanı varsa işle
        if IP in packet:
            packet_data = {
                "src": packet[IP].src,
                "dst": packet[IP].dst,
                "proto":  packet[IP].proto,
                "len":    len(packet),
                "timestamp":     float(packet.time) # JSON serileştirme için float'a çevir
            }

            # Asenkron gönderim
            producer.produce(
                'raw-traffic', 
                value=json.dumps(packet_data).encode('utf-8'), 
                callback=delivery_report
            )
            
            # poll(0) her pakette çağrılmalı ama print içermemeli
            producer.poll(0)
            producer.flush(0)  # Gönderim kuyruğunu boşaltmak için
    except Exception as e:
        pass # Hataları sessizce geç (performans için)

print("Dinleme başlatıldı... (Kesmek için CTRL+C)")

# 3. store=0 bellek dolmasını engeller
# 4. count=0 sonsuz döngü sağlar
sniff(prn=process_and_send, store=0, filter="ip", count=0)