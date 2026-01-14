package com.sentinel.analyzer.service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.io.IOException;
import java.net.InetAddress;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ThreatIntelService {
    private DatabaseReader dbReader;

    public static final Logger log = LoggerFactory.getLogger(ThreatIntelService.class);
    private final RestClient restClient;

    // Performans için sorgulanan IP'leri cache'liyoruz
    private final Map<String, String> geoCache = new ConcurrentHashMap<>();

    public ThreatIntelService() throws IOException {
        this.restClient = RestClient.create();
        File database = new File(getClass().getClassLoader().getResource("GeoLite2-City.mmdb").getFile());
        this.dbReader = new DatabaseReader.Builder(database).build();
    }

    public boolean isIpMalicious(String ip){
        log.info("Checking IP intelligence for: {} on thread: {}", ip, Thread.currentThread());
        try {
            //For Simulation added 200ms to be placeholder
            Thread.sleep(200);
            //For test added, Ip ends with ".100" is malicious
            return ip.endsWith(".100") || ip.startsWith("45.");
        }catch (InterruptedException e){
            Thread.currentThread().interrupt();
            return false;
        }
    }

    public Map<String,String> getLocationInfo(String ip){
        try{
            InetAddress ipAddress = InetAddress.getByName(ip);
            CityResponse response = dbReader.city(ipAddress);

            return Map.of(
                    "country",response.getCountry().getName(),
                    "city", response.getCity().getName()
            );
        }catch (Exception e){
            return Map.of(
                    "country","unknow",
                    "city","unknow");
        }
    }

/* GeoLite kullanıldığı için gerek kalmadı.
    public String getCountry(String ip){
        return geoCache.computeIfAbsent(ip, this::resolveCountry);
    }

    public String resolveCountry(String ip){
        if (ip.startsWith("192.") || ip.startsWith("127.")) return "Local Network";

        // Profesyonel Simülasyon: Gerçek IP bloklarına göre ülke eşleşmesi
        // Not: Gerçek projede burada mmdb dosyası okunur.

        int firstOctet = Integer.parseInt(ip.split("\\.")[0]);

        if (firstOctet < 40) return "USA";
        if (firstOctet < 80) return "Russia";
        if (firstOctet < 120) return "China";
        if (firstOctet < 160) return "Germany";
        if (firstOctet < 200) return "Netherlands";
        if (firstOctet < 230) return "Turkey";

        return "Unknown";
    }
 */
}
