package com.sentinel.analyzer.controller;

import com.sentinel.analyzer.service.AnalysisService;
import com.sentinel.shared.dto.PacketDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/packets")
@CrossOrigin(origins = "*")
public class PacketSimulationController {
    private final AnalysisService analysisService;

    public PacketSimulationController(AnalysisService analysisService) {
        this.analysisService = analysisService;
    }

    @PostMapping("/simulate")
    public ResponseEntity<String> simulatePacket(@RequestBody PacketDTO packet) {
        analysisService.processPacket(packet);

        return ResponseEntity.ok("Paket analize gönderildi: " + packet.getSrc());
    }
}
