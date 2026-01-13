package com.sentinel.analyzer.service;

import com.sentinel.shared.dto.PacketDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Service
public class AnalysisService {
    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);
    private final KafkaTemplate<String,Object> kafkaTemplate;

    @Autowired
    private StringRedisTemplate redisTemplate;

    @Autowired
    private ThreatIntelService threatIntelService;

    public AnalysisService(KafkaTemplate<String,Object> kafkaTemplate, StringRedisTemplate redisTemplate){
        this.kafkaTemplate = kafkaTemplate;
        this.redisTemplate = redisTemplate;

    }

    @KafkaListener(topics = "raw-traffic", groupId = "sentinel-analyzer-group")
    public void analyze(PacketDTO packet){
        if (packet.getSrc() == null) return;

        boolean isBlackListed = threatIntelService.isIpMalicious(packet.getSrc());

        boolean isAnomaly = false;
        String reason = "";

        redisTemplate.opsForZSet().incrementScore("top-talkers",packet.getSrc(),1);

        String scanKey = "scan:" + packet.getSrc();
        String footprint = packet.getDst() + ":" + packet.getProto();
        redisTemplate.opsForSet().add(scanKey,footprint);
        redisTemplate.expire(scanKey, Duration.ofSeconds(30));
        Long uniqueTargets = redisTemplate.opsForSet().size(scanKey);

        if (isBlackListed) {
            isAnomaly = true;
            reason = "IP Blacklisted (Known Threat Actor)";
        }
        else if (uniqueTargets != null && uniqueTargets > 20) { // YENİ KARAR
            isAnomaly = true;
            reason = "Port Scanning / Network Discovery Detected";
            redisTemplate.delete(scanKey); // Tespit sonrası temizle
        }
        else if (packet.getLen() > 1000) {
            isAnomaly = true;
            reason = "High Volume Packet (Potential Data Exfiltration)";
        }

        if (isAnomaly){
            log.warn("!!! ANOMALY DETECTED: {} | Reason: {}", packet, reason);
            Map<String, String> alertPayload = new HashMap<>();
            alertPayload.put("src", packet.getSrc());
            alertPayload.put("dst",packet.getDst());
            alertPayload.put("reason",reason);

            String bankey = "banned_ips";
            redisTemplate.opsForSet().add(bankey,packet.getSrc());
            redisTemplate.expire(bankey, Duration.ofMinutes(10));
            log.error(">>> IP BANNED: {}. Traffic from this source will be dropped.", packet.getSrc());

            kafkaTemplate.send("alerts", alertPayload);
        }else {
            log.info("Normal Traffic: {} -> {}", packet.getSrc(), packet.getDst());
        }
    }
}
