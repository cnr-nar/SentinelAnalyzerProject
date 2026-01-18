# Sentinel-System

## A Distributed, Real-Time Network Anomaly Detection Platform

---

## Abstract

Modern critical infrastructures face increasingly sophisticated network-based threats that demand deterministic, low-latency, and scalable detection mechanisms. **Sentinel-System** is a distributed network anomaly detection platform designed to bridge the gap between raw packet-level telemetry and high-level intelligent analysis. By combining real-time packet capture, message-oriented middleware, machine learning–based inference, and modern concurrency primitives, Sentinel-System delivers a resilient and deployable solution for both cloud-scale environments and resource-constrained edge systems.

---

## 1. Introduction

The exponential growth of network traffic, coupled with the rise of automated and distributed attacks (e.g., DDoS, reconnaissance scanning, protocol abuse), has rendered traditional signature-based intrusion detection systems insufficient. Sentinel-System addresses this challenge through a modular architecture that emphasizes:

* Deterministic behavior under load
* Low end-to-end detection latency
* Horizontal scalability and fault isolation
* Deployability on constrained hardware

The system is particularly suited for high-integrity environments such as defense networks, industrial control systems, and sovereign cloud infrastructures.

---

## 2. System Architecture

Sentinel-System follows a layered architecture inspired by biological defense systems, where each layer has a clearly defined responsibility and failure domain.

### 2.1 Data Collection Layer (Sensory Organ)

This layer operates at the network edge and is responsible for transforming raw traffic into structured telemetry.

* **Packet Capture**: Network interfaces are monitored in promiscuous mode using Scapy, enabling full visibility into ingress and egress traffic.
* **Feature Engineering**: Low-level packet attributes (IP headers, TCP/UDP flags, packet lengths, temporal features) are transformed into numerical vectors suitable for downstream analysis.
* **Asynchronous Emission**: Feature vectors are published to Apache Kafka using optimized batching strategies to ensure lossless ingestion during traffic bursts.

### 2.2 Messaging and Orchestration (Central Nervous System)

This layer decouples data producers from consumers, ensuring system stability under variable load.

* **Apache Kafka** provides durable message storage, replayability, and backpressure management.
* **Redis** functions as a high-speed, in-memory state store, supporting real-time frequency analysis and instantaneous synchronization with visualization components.

### 2.3 Analysis and Decision Engine (Cognitive Core)

The analytical core of Sentinel-System performs real-time classification and anomaly detection.

* **Unsupervised Learning**: Isolation Forest models identify deviations from baseline network behavior.
* **Supervised Learning**: Random Forest classifiers detect deterministic malicious patterns such as port scanning and volumetric attacks.
* **Streaming Inference**: Consumers process Kafka streams, execute inference with bounded latency, and publish structured anomaly events.

### 2.4 Processing and Visualization Layer (Command Center)

This layer provides operational awareness and human-in-the-loop interaction.

* **Java 21 with Project Loom**: Virtual threads (`VirtualThreadPerTaskExecutor`) enable massive concurrency while maintaining a minimal memory footprint.
* **Reactive Interfaces**: A Spring Boot–based WebSocket service streams alerts to a Next.js dashboard for near-instant situational awareness.

---

## 3. Performance and Resource Determinism

Sentinel-System is explicitly engineered for environments with strict resource constraints.

* **Containerized Validation**: Tested under Docker limits of 0.5 CPU cores and 512 MB RAM.
* **JVM Memory Discipline**: Carefully tuned heap sizing (`-Xms`, `-Xmx`) minimizes garbage collection pauses.
* **Concurrency Efficiency**: Empirical benchmarks demonstrate superior throughput and latency stability of virtual threads compared to traditional platform threads under constrained CPU budgets.

---

## 4. Technology Stack

| Component           | Technologies           |
| ------------------- | ---------------------- |
| Languages           | Java 21, Python 3.10   |
| Messaging           | Apache Kafka           |
| State & Persistence | Redis, PostgreSQL      |
| Machine Learning    | Scikit-learn           |
| Infrastructure      | Docker, Docker Compose |
| Visualization       | Next.js, Tailwind CSS  |

---

## 5. Deployment

### 5.1 Prerequisites

* Docker
* Docker Compose

### 5.2 GeoIP Integration

For geolocation enrichment, the following MaxMind databases must be provided in the `resources` directory:

* `GeoLite2-City.mmdb`
* `GeoLite2-Country.mmdb`

### 5.3 Installation Procedure

```bash
git clone https://github.com/cnr-nar/SentinelAnalyzerProject.git
cd SentinelAnalyzerProject
docker-compose up -d
```

Environment-specific configuration is managed through the `.env` file.

---

## 6. Compliance, Auditability, and Response

* **Forensic Persistence**: All high-severity anomalies are persisted in PostgreSQL for post-incident analysis.
* **Automated Mitigation**: Redis-backed banning and throttling mechanisms enable rapid response workflows.
* **Design Principles**: The system adheres to clean architecture and modular design practices aligned with modern cybersecurity monitoring standards.

---

## 7. Conclusion

Sentinel-System demonstrates that high-performance, intelligent network anomaly detection can be achieved without sacrificing determinism or deployability. By integrating modern JVM concurrency models, distributed messaging, and machine learning, the platform provides a sovereign, scalable, and future-ready foundation for securing critical network infrastructures.

---

**Sentinel-System — Security, Scalability, Sovereignty.**
