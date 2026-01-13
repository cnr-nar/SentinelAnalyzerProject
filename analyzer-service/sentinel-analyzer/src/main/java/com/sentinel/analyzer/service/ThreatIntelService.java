package com.sentinel.analyzer.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ThreatIntelService {
    public static final Logger log = LoggerFactory.getLogger(ThreatIntelService.class);
    private final RestClient restClient;

    public ThreatIntelService(){
        this.restClient = RestClient.create();
    }

    public boolean isIpMalicious(String ip){
        log.info("Checking IP intelligence for: {} on thread: {}", ip, Thread.currentThread());
        try {
            //For Simulation added 200ms to be placeholder
            Thread.sleep(200);

            //For test added, Ip ends with ".100" is malicious
            return ip.endsWith(".100");
        }catch (InterruptedException e){
            Thread.currentThread().interrupt();
            return false;
        }
    }
}
