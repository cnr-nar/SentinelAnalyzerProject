package com.sentinel.analyzer.service;

import com.maxmind.geoip2.DatabaseReader;
import com.maxmind.geoip2.model.CityResponse;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.InetAddress;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ThreatIntelService {
    private DatabaseReader dbReader;

    public static final Logger log = LoggerFactory.getLogger(ThreatIntelService.class);
    private final RestClient restClient;

    @Value("${sentinel.abuseipdb.key}")
    private String abuseIpDbKey;

    // Performans için sorgulanan IP'leri cache'liyoruz
    private final Map<String, Map<String, String>> geoCache = new ConcurrentHashMap<>();
    private final Map<String, Boolean> maliciousCache = new ConcurrentHashMap<>();

    // Hızlı Blacklist Kontrolü
    private final Set<String> blacklistedRanges = Set.of("45.", "185.");

    public ThreatIntelService() throws IOException {
        this.restClient = RestClient.create();
    }

    @PostConstruct
    public void init(){
        try (InputStream dbStream = getClass().getResourceAsStream("/GeoLite2-City.mmdb")){
            if (dbStream != null){
                this.dbReader = new DatabaseReader.Builder(dbStream).build();
                log.info("ThreatIntel: Geo-IP Engine Ready.");
            }
        }catch (Exception e){
            log.error("ThreatIntel: Geo-IP Init Failed: {}", e.getMessage());
        }
    }

    public boolean isIpMalicious(String ip){
        if (maliciousCache.containsKey(ip)) return maliciousCache.get(ip);

        for (String range: blacklistedRanges){
            if (ip.startsWith(range)){
                maliciousCache.put(ip,true);
                return true;
            }
        }

        // Simülasyon için kendi kural setim, değişitirilebilir, kapatılabilir.
//        if (ip.endsWith(".100")){
//            maliciousCache.put(ip,true);
//            return true;
//        }

        //External Intelligence (AbuseIPDB)
        boolean isExternalMalicious = checkAbuseIPDB(ip);
        maliciousCache.put(ip, isExternalMalicious);

        return isExternalMalicious;
    }

    private boolean checkAbuseIPDB(String ip){
        if (ip.equals("127.0.0.1") || ip.startsWith("192.168")) return false;

        try {
            log.info("Consulting external intelligence (AbuseIPDB) for: {}", ip);
            Map<String , Object> response = restClient.get()
                    .uri("https://api.abuseipdb.com/api/v2/check?ipAddress={ip}", ip)
                    .header("key",abuseIpDbKey)
                    .retrieve()
                    .body(Map.class);

            if (response != null && response.get("data") != null){
                Map<String, Object> data = (Map<String, Object>) response.get("data");
                int abuseConfidenceScore = (int) data.get("abuseConfidenceScore");

                log.info("IP {} has Abuse Confidence Score: {}", ip, abuseConfidenceScore);

                // Score > 75 ise malicious kabul ediyoruz
                return abuseConfidenceScore > 75;
            }
        }catch (Exception e){
            log.error("AbuseIPDB API Error for IP {}: {}", ip, e.getMessage());
        }
        return false;
    }

    public Map<String,String> getLocationInfo(String ip){
        if (geoCache.containsKey(ip)) return geoCache.get(ip);

        try {
            InetAddress ipAddress = InetAddress.getByName(ip);
            CityResponse response = dbReader.city(ipAddress);
            Map<String, String> info = Map.of(
                    "country", response.getCountry().getName() != null ? response.getCountry().getName() : "Unknown",
                    "city", response.getCity().getName() != null ? response.getCity().getName() : "Unknown"
            );
            geoCache.put(ip, info);
            return info;
        } catch (Exception e) {
            return Map.of("country", "Unknown", "city", "Unknown");
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
