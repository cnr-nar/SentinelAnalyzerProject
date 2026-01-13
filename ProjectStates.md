1. Aşama Özeti (Altyapı ve Veri Akışı)
1. Konteynırlaştırma (Docker):

Kafka & Zookeeper: Sistemin ana haberleşme omurgasını kurduk. Veriler kaybolmadan burada toplanıyor.

Redis: Hızlı veri analizi ve anomali bayrakları (flag) için bellek içi veritabanımızı hazır hale getirdik.

Önemli Not: confluentinc imajlarını kullanarak kurumsal standartta bir yapı kurduk.

2. Geliştirme Ortamı (Python 3.14):

Python kurulumunu "Path" sorunlarını aşarak stabilize ettik. pip artık her yerden çalışıyor.

Npcap Sürücüsü: Windows'un ağ kartına erişim engelini bu sürücüyle aştık.

3. Veri Üretici (Python Sniffer):

scapy kütüphanesi ile yerel ağ kartından geçen canlı IP paketlerini yakaladık.

Yalanan paketleri (Kaynak IP, Hedef IP, Protokol, Uzunluk) JSON formatına dönüştürdük.

confluent-kafka kütüphanesini kullanarak bu verileri Kafka’nın network-traffic kanalına (topic) başarıyla bastık.

4. Doğrulama (Validation):

Hem terminal üzerinden hem de bir Python consumer scripti ile Kafka'daki veriyi okuduk.

Sonuç: Veri hattı (Data Pipeline) uçtan uca çalışıyor. Python veriyi yakalıyor -> Kafka’ya gönderiyor -> Veri Kafka’da işlenmeyi bekliyor.