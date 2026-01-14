package com.sentinel.dashboard.controller;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/firewall")
@CrossOrigin(origins = "http://localhost:3000")
public class FirewallController {
    private final StringRedisTemplate redisTemplate;

    public FirewallController(StringRedisTemplate redisTemplate){
        this.redisTemplate = redisTemplate;
    }

    @GetMapping("/banned")
    public Set<String> getBannedIps(){
        return redisTemplate.opsForSet().members("banned_ips");
    }

    @DeleteMapping("/unblock/{ip}")
    public void unblockIp(@PathVariable String ip){
        redisTemplate.opsForSet().remove("banned_ips",ip);
    }
}
