from scapy.all import sniff, IP
from confluent_kafka import Producer
import json
import socket
import redis

# 1. Redis Bağlantısı
# Java tarafındaki AnalysisService ile aynı Redis veritabanına bağlanıyoruz
try:
    r = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    print("Redis connection is up.")
except Exception as e:
    print(f"Redis connection error: {e}")

# 2. Kafka Yapılandırması
conf = {
    'bootstrap.servers': 'localhost:9092',
    'client.id': socket.gethostname(),
    'linger.ms': 0,               
    'batch.size': 1000000,
    'compression.type': 'lz4',
    'queue.buffering.max.messages': 1000000
}

producer = Producer(conf)

def delivery_report(err, msg):
    if err is not None:
        print(f"Hata: {err}")

def process_and_send(packet):
    try:
        if IP in packet:
            src_ip = packet[IP].src
            
            # Java/Analyzer bir IP'yi 'banned_ips' setine eklemiş mi kontrol et
            if r.sismember("banned_ips", src_ip):
                # Eğer IP banlıysa, trafiği Kafka'ya göndermeden burada düşür (drop)
                # Konsolda çok fazla kirlilik olmaması için loglamayı opsiyonel tutabilirsin
                # print(f" [!] BLOCKED: Traffic from {src_ip} dropped.")
                return 

            packet_data = {
                "src": src_ip,
                "dst": packet[IP].dst,
                "proto": packet[IP].proto,
                "len": len(packet),
                "timestamp": float(packet.time)
            }

            producer.produce(
                'raw-traffic', 
                value=json.dumps(packet_data).encode('utf-8'), 
                callback=delivery_report
            )
            
            producer.poll(0)
    except Exception as e:
        pass

print("Sentinel Firewall & Sniffer is active... (CTRL+C to stop)")

# store=0 bellek dolmasını engeller, filter="ip" sadece IP trafiğine bakar
sniff(prn=process_and_send, store=0, filter="ip", count=0)