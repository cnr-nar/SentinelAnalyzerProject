# 🛡️ Sentinel-System: Distributed Network Anomaly Detector

## 📋 Overview

**Sentinel-System** is a high-performance, modular platform for real-time network anomaly detection. It bridges low-level packet capture with high-level asynchronous analysis, providing a robust and scalable defense mechanism for critical infrastructure.

The system is designed with **determinism**, **low latency**, and **horizontal scalability** as first-class principles, making it suitable for both enterprise cloud deployments and resource-constrained edge devices.

---

## 🏗️ System Architecture

Sentinel-System is structured into four distinct layers, inspired by a biological defense mechanism:

### 1️⃣ Data Collection Layer (Sensory Organ)

The frontline probe responsible for capturing and preprocessing raw network telemetry.

* **Packet Capture**: Uses *Scapy* to monitor network interfaces in promiscuous mode.
* **Feature Extraction**: Transforms raw packet data (IP headers, TCP/UDP flags, packet sizes) into structured numerical feature vectors.
* **Asynchronous Production**: Streams processed telemetry to **Apache Kafka** with optimized batching to prevent packet loss during peak traffic.

---

### 2️⃣ Messaging & Orchestration (Central Nervous System)

Ensures full decoupling between data ingestion and computationally intensive analysis.

* **Apache Kafka**: Acts as a persistent message buffer and backpressure manager.
* **Redis (In-Memory State)**: Sub-millisecond caching layer for:

  * Real-time frequency analysis
  * Instant state synchronization for the security dashboard

---

### 3️⃣ Analysis & Decision Engine (The Brain)

The intelligence core responsible for anomaly detection and classification.

* **Machine Learning Models**:

  * *Isolation Forest* for detecting stochastic anomalies
  * *Random Forest* for identifying deterministic malicious patterns (e.g., DDoS, port scanning)
* **Real-Time Inference**:

  * Consumes telemetry from Kafka
  * Executes ML inference
  * Publishes anomaly alerts back to the orchestration layer

---

### 4️⃣ Processing & Visualization (Command Center)

High-density processing and visualization layer built with modern Java.

* **Java 21 + Project Loom**:

  * Uses `VirtualThreadPerTaskExecutor`
  * Enables massive concurrency with minimal memory overhead compared to traditional threads
* **Reactive Dashboard**:

  * Streams real-time alerts via WebSockets (Spring Boot)
  * Visualized through a **Next.js** frontend for instant situational awareness

---

## ⚙️ Optimization & Embedded Awareness

Sentinel-System is optimized for deployment in constrained environments such as edge gateways and defense systems.

* **Deterministic Resource Allocation**:

  * Validated under strict Docker limits (`cpus: 0.5`, `memory: 512M`)
* **JVM Tuning**:

  * Custom `-Xms` and `-Xmx` settings
  * Reduced GC overhead and latency spikes
* **High Throughput**:

  * Benchmarked to demonstrate the efficiency of **Virtual Threads** under limited CPU resources

---

## 🛠️ Technology Stack

| Layer               | Technologies                                    |
| ------------------- | ----------------------------------------------- |
| Languages           | Java 21 (Virtual Threads), Python 3.10          |
| Messaging           | Apache Kafka                                    |
| Persistence & Cache | PostgreSQL (Forensics), Redis (Real-Time State) |
| Intelligence        | Scikit-learn                                    |
| Infrastructure      | Docker, Docker Compose                          |
| Frontend            | Next.js, Tailwind CSS, Lucide Icons             |

---

## 🚀 Getting Started

### Prerequisites

* Docker
* Docker Compose

### GeoIP Databases

For IP geolocation features, download and place the following files in the `resources` directory:

* `GeoLite2-City.mmdb`
* `GeoLite2-Country.mmdb`

(Available from MaxMind)

---

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/cnr-nar/SentinelAnalyzerProject.git
   ```

2. **Configure environment variables**
   Update the `.env` file with your database credentials and required API keys.

3. **Deploy the system**

   ```bash
   docker-compose up -d
   ```

---

## 📝 Compliance & Standards

* **Modular Architecture**: Follows clean code and modular design principles
* **Forensic Persistence**: All critical alerts are stored in PostgreSQL for audit and investigation
* **Automated Response**: Redis-based banning mechanisms enable rapid mitigation

Designed for **high-integrity network environments**.

---

## 🔐 Sentinel-System

**Security. Scalability. Sovereignty.**
