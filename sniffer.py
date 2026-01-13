from scapy.all import sniff, IP, TCP, UDP
from confluent_kafka import Producer
import json
import socket

# Kafka producer configuration
conf={'bootstrap.servers':'localhost:9092', 'client.id': socket.gethostname() }
producer = Producer(conf)

def delivery_report(err, msg):
    if err is not None:
        print(f"Message delivery failed: {err}")
    else:
        print(f"Message delivered to {msg.topic()} [{msg.partition()}]")


def process_and_send(packet):
    if IP in packet:
        # For ML model processing
        packet_data = {
            "src_ip": packet[IP].src,
            "dst_ip": packet[IP].dst,
            "protocol": packet[IP].proto,
            "size": len(packet),
            "timestamp": packet.time
        }

        payload = json.dumps(packet_data).encode('utf-8')
        producer.produce('raw-traffic', value=payload, callback=delivery_report)
        producer.poll(0)

sniff(prn=process_and_send, store=0, filter="ip" )