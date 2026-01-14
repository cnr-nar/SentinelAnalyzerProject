import json
import numpy as np
from confluent_kafka import Producer, Consumer
from sklearn.ensemble import IsolationForest

# 1. AI Modelini Hazırla (Eğitim)
# Özellikler: [Protokol, Paket Boyutu]
# Normal trafik örnekleri: Genelde küçük paketler (TCP/UDP)
print("Training AI Model...")
X_train = np.array([[6, 64], [17, 128], [6, 1500], [1, 32], [6, 40], [17, 72]])
model = IsolationForest(contamination=0.1, random_state=42)
model.fit(X_train)

# 2. Kafka Yapılandırması
consumer = Consumer({
    'bootstrap.servers': 'localhost:9092',
    'group.id': 'sentinel-ai-engine',
    'auto.offset.reset': 'latest',
    'enable.auto.commit': True
})
consumer.subscribe(['raw-traffic'])
producer = Producer({'bootstrap.servers': 'localhost:9092'})

print("AI Engine Online: Behavior Analysis Started...")

while True:
    msg = consumer.poll(1.0)
    if msg is None: continue
    
    packet = json.loads(msg.value().decode('utf-8'))
    
    # AI Tahmini: Özellikleri modele sokalım
    # features: [proto, len]
    features = np.array([[packet.get('proto', 0), packet.get('len', 0)]])
    prediction = model.predict(features)[0] # -1: Anomali, 1: Normal
    
    if prediction == -1:
        # AI bir gariplik sezerse doğrudan 'alerts' topic'ine kendi raporunu gönderir
        alert_data = {
            "src": packet.get('src'),
            "dst": packet.get('dst'),
            "reason": "AI ANALYTICS: Statistical Anomaly (Unusual Pattern Detected)"
        }
        producer.produce('alerts', value=json.dumps(alert_data).encode('utf-8'))
        producer.flush()
        print(f" [!] AI Flagged: {packet['src']} as Anomaly")

consumer.close()