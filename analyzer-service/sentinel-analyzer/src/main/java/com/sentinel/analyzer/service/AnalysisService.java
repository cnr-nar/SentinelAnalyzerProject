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
import java.util.List;
import java.util.Map;

@Service
public class AnalysisService {
    private static final Logger log = LoggerFactory.getLogger(AnalysisService.class);
    private final KafkaTemplate<String,Object> kafkaTemplate;
    private final StringRedisTemplate redisTemplate;
    private final ThreatIntelService threatIntelService;

    private static final List<String> MALICIOUS_SIGNATURES = List.of(
            "DROP TABLE", "SELECT * FROM", "OR 1=1", "--", //SQL Injection
            "/BIN/SH", "/BIN/BASH", "NC -E", "EXEC("   // Reverse Shell/RCE
    );

    public AnalysisService(KafkaTemplate<String,Object> kafkaTemplate,
                           StringRedisTemplate redisTemplate,
                           ThreatIntelService threatIntelService){
        this.kafkaTemplate = kafkaTemplate;
        this.redisTemplate = redisTemplate;
        this.threatIntelService = threatIntelService;

    }

    @KafkaListener(topics = "raw-traffic", groupId = "sentinel-analyzer-group")
    public void analyze(PacketDTO packet){
        if (packet.getSrc() == null) return;

        //Thread-Intel Control
        if (threatIntelService.isIpMalicious(packet.getSrc())){
            handleAnomaly(packet,"IP Blacklisted (Known Threat Actor)");
            return;
        }

        //DPI signature control
        if (packet.getPayload() != null && !packet.getPayload().isEmpty()){
            String content = packet.getPayload().toUpperCase();
            for(String signature: MALICIOUS_SIGNATURES){
                if (content.contains(signature)){
                    handleAnomaly(packet,"DPI ALERT: Malicious Signature Detected (" + signature + ")");
                    return;
                }
            }
        }

        redisTemplate.opsForZSet().incrementScore("top-talkers",packet.getSrc(),1);

        //Port Scan data
        String scanKey = "scan:" + packet.getSrc();
        String footprint = packet.getDst() + ":" + packet.getProto();
        redisTemplate.opsForSet().add(scanKey,footprint);
        redisTemplate.expire(scanKey, Duration.ofSeconds(30));

        Long uniqueTargets = redisTemplate.opsForSet().size(scanKey);

        if (uniqueTargets != null && uniqueTargets > 20) {
            handleAnomaly(packet,"Port Scanning / Network Discovery Detected");
            redisTemplate.delete(scanKey);
            return;
        }
        else if (packet.getLen() > 1000) {
            handleAnomaly(packet, "High Volume Packet (Potential Data Exfiltration)");
        }else {
            log.info("Normal Traffic: {} -> {}", packet.getSrc(), packet.getDst());
        }
    }

    private void handleAnomaly(PacketDTO packet, String reason){
        log.warn("!!! ANOMALY DETECTED: {} | Reason: {}", packet, reason);

        String bankey = "banned_ips";
        redisTemplate.opsForSet().add(bankey,packet.getSrc());
        redisTemplate.expire(bankey, Duration.ofMinutes(10));
        log.error(">>> IP BANNED: {}. Reason: {}.", packet.getSrc(),reason);

        Map<String, String> alertPayload = new HashMap<>();
        alertPayload.put("src", packet.getSrc());
        alertPayload.put("dst",packet.getDst());
        alertPayload.put("reason",reason);
        kafkaTemplate.send("alerts", alertPayload);
    }
}
