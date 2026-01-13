package com.sentinel.dashboard.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
public class AlertRelayService {
    public final SimpMessagingTemplate messagingTemplate;

    public AlertRelayService(SimpMessagingTemplate messagingTemplate){
        this.messagingTemplate = messagingTemplate;
    }

    @KafkaListener(topics = "alerts", groupId = "sentinel-dashboard-group")
    public void relayAlert(String alertMessage){
        messagingTemplate.convertAndSend("/topic/alerts", alertMessage);
    }
}
