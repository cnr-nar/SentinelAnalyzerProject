package com.sentinel.ingestor.service;

import com.sentinel.shared.dto.PacketDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class TrafficConsumer {
    private static final Logger log = LoggerFactory.getLogger(TrafficConsumer.class);

    @KafkaListener(topics = "raw-traffic",groupId = "sentinel-ingestion-group")
    public void consume(PacketDTO packet){
        log.info("Received packet from {} to {} on thread: {}",
                packet.getSrc(),packet.getDst(),Thread.currentThread());

        processInternal(packet);
    }

    private void processInternal(PacketDTO packet){
        // Simüle edilmiş ağır bir analiz/loglama işlemi
        // Sanal thread'ler sayesinde burada bloklama yapmak sistemi yavaşlatmaz.
        try {
            Thread.sleep(10); // 10ms işleme süresi
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
