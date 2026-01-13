🛡️ SentinelAnalyzerProject: 
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
