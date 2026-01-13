(EN)🛡️ SentinelAnalyzerProject: System Architecture
1. Data Collection Layer (Python Sniffer)
This layer acts as the "sensory organ," capturing raw network packets and integrating them into the system.

Packet Capture: Developing a script using Scapy or PyShark libraries to monitor network traffic.

Feature Extraction: Converting raw data (IP, port, packet size, protocol, etc.) into numerical features compatible with Machine Learning models.

Kafka Producer: Streaming processed data to the Apache Kafka raw-traffic topic with low latency.

2. Messaging and Queuing Layer (Apache Kafka & Redis)
The "central nervous system" that ensures modularity and scalability.

Kafka Cluster Setup: Deploying Kafka and Zookeeper (or KRaft) using Docker.

Speed and Buffering: Queuing high-volume data from Python before it is passed to the Java backend.

Fast Access (Redis): A caching layer to provide real-time statistics or the latest detected anomalies to the Dashboard instantly.

3. Analysis and Decision Mechanism (Python ML)
The "brain" of the system, responsible for determining whether the data is "abnormal."

Model Training: Teaching the system normal traffic patterns using Scikit-learn (e.g., via Isolation Forest or Random Forest algorithms).

Real-time Prediction: Processing incoming Kafka data through the model to label it as "Attack/Anomaly" or "Normal."

Result Transmission: Publishing analysis results back to the Kafka alerts topic.

4. Processing and Visualization Layer (Java 21 & Spring Boot)
The component that handles high-density data processing using Java 21’s Virtual Threads (Project Loom).

Consumption via Virtual Threads: Writing Kafka consumers that process thousands of alerts in parallel without exhausting system resources.

API Development: Creating a REST or WebSocket API with Spring Boot to expose anomaly data.

Dashboard: Developing a user interface featuring real-time charts (speed, traffic density, anomaly counts).

5. Optimization and Deployment (Docker & Resource Limiting)
The stage where the project gains "Embedded Awareness."

Containerization: Writing Dockerfiles for each module (Java, Python, Kafka).

Resource Constraints: Testing performance on low-end hardware (like Raspberry Pi) by setting cpus: 0.5 and memory: 512M limits in Docker Compose.

Performance Benchmarking: Measuring the advantages of Java Virtual Threads over traditional threading models under restricted resource conditions.

(TR)🛡️ SentinelAnalyzerProject: 
1. Katman: Veri Toplama (Python Sniffer)
Bu katman, ağdaki ham paketleri yakalayıp sisteme dahil eden "duyu organıdır".

Paket Yakalama: Scapy veya PyShark kütüphanelerini kullanarak ağ trafiğini dinleyen bir script yazılması.

Özellik Çıkarımı (Feature Extraction): Ham veriden (IP, port, paket boyutu, protokol vb.) ML modelinin anlayabileceği sayısal verilerin oluşturulması.

Kafka Producer: İşlenen bu verilerin düşük gecikmeyle Apache Kafka'ya "raw-traffic" topic'i üzerinden gönderilmesi.

2. Katman: Mesajlaşma ve Kuyruk (Apache Kafka & Redis)
Sistemin modülerliğini ve ölçeklenebilirliğini sağlayan merkezi sinir sistemidir.

Kafka Cluster Kurulumu: Docker üzerinde Kafka ve Zookeeper (veya KRaft) ayağa kaldırılması.

Hız ve Tamponlama: Python'dan gelen yoğun verinin Java tarafına geçmeden önce kuyruğa alınması.

Hızlı Erişim (Redis): Anlık istatistiklerin veya son tespit edilen anomalilerin hızlıca Dashboard'a sunulması için önbellekleme katmanı.

3. Katman: Analiz ve Karar Mekanizması (Python ML)
Verinin "anormal" olup olmadığına karar veren beyin kısmıdır.

Model Eğitimi: Scikit-learn ile (örneğin Isolation Forest veya Random Forest kullanarak) normal trafik desenlerinin öğretilmesi.

Gerçek Zamanlı Tahmin: Kafka'dan gelen verilerin modele sokularak "Saldırı/Anomali" veya "Normal" olarak etiketlenmesi.

Sonuç İletimi: Analiz sonuçlarının tekrar Kafka'daki "alerts" topic'ine basılması.

4. Katman: İşleme ve Görselleştirme (Java 21 & Spring Boot)
Java 21'in Virtual Threads (Project Loom) özelliğini kullanarak yüksek yoğunluklu veriyi işleme kısmıdır.

Virtual Threads ile Tüketim: Kafka'dan gelen binlerce alarmı, sistem kaynaklarını tüketmeden paralel olarak işleyecek "Consumer"ların yazılması.

API Geliştirme: Spring Boot ile anomali verilerini dış dünyaya sunan bir REST veya WebSocket API oluşturulması.

Dashboard: Gerçek zamanlı grafikler (hız, trafik yoğunluğu, anomali sayısı) içeren bir arayüz geliştirilmesi.

5. Katman: Optimizasyon ve Dağıtım (Docker & Resource Limiting)
Projenin "Gömülü Sistem Farkındalığı" (Embedded Awareness) kazandığı aşamadır.

Konteynerleştirme: Her modülün (Java, Python, Kafka) Dockerfile'larının yazılması.

Kaynak Kısıtlama: Docker Compose üzerinde cpus: 0.5 ve memory: 512M gibi limitler koyarak, yazılımın düşük donanımlı cihazlarda (Raspberry Pi gibi) nasıl performans gösterdiğinin test edilmesi.

Performans İyileştirme: Kısıtlı kaynak altında Java Virtual Threads kullanımının geleneksel thread yapısına göre avantajlarının ölçümlenmesi.
