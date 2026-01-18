package com.sentinel.analyzer.controller;

import com.sentinel.analyzer.model.AnomalyEvent;
import com.sentinel.analyzer.repository.AnomalyRepository;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AnalysisController {
    private final AnomalyRepository anomalyRepository;

    public AnalysisController(AnomalyRepository anomalyRepository) {
        this.anomalyRepository = anomalyRepository;
    }

    @GetMapping("/history")
    public List<AnomalyEvent> getAlertHistory() {
        return anomalyRepository.findTop10ByOrderByTimestampDesc();
    }
}
