package com.sentinel.analyzer.repository;

import com.sentinel.analyzer.model.AnomalyEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnomalyRepository extends JpaRepository<AnomalyEvent, Long> {
    List<AnomalyEvent> findTop10ByOrderByTimestampDesc();
}
