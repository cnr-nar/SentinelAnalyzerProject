🛡️ Sentinel-System: Distributed Network Anomaly Detector
Concept: A high-performance, modular platform designed to detect network-level anomalies in real-time by bridging low-level data capture with high-level asynchronous processing.

🏗️ System Architecture
1. Data Collection Layer (Sensory Organ)
Acts as the frontline probe, capturing raw network telemetry and preparing it for the pipeline.

Packet Capture: Leveraging Scapy to monitor network interfaces in promiscuous mode.

Feature Extraction: Transforming raw hex data (IP headers, TCP/UDP flags, packet sizes) into structured numerical vectors.

Asynchronous Production: Streaming processed telemetry to the raw-traffic Kafka topic with optimized batching to ensure zero packet loss.

2. Messaging & Orchestration Layer (Central Nervous System)
Ensures total decoupling between data collection and heavy analysis.

Apache Kafka: Acts as a persistent message buffer, providing backpressure management; even if the analysis layer spikes in CPU usage, the capture layer continues uninterrupted.

Redis (Fast Access): A sub-millisecond caching layer used for Real-Time Frequency Analysis (e.g., tracking IP hit rates) and providing instant state updates to the dashboard.

3. Analysis & Decision Engine (The Brain)
Responsible for intelligence-driven anomaly classification.

Machine Learning (Scikit-learn): Employs algorithms like Isolation Forest or Random Forest to distinguish between normal traffic patterns and malicious signatures (e.g., DDoS, Port Scanning).

Real-time Inference: Consumes from Kafka, runs the ML model, and publishes "Anomaly Alerts" back to the orchestration layer.

4. Processing & Visualization Layer (Processing Hub)
The high-density data processing unit built with Java 21.

Virtual Threads (Project Loom): Implements a VirtualThreadPerTaskExecutor to achieve massive concurrency. Unlike traditional platform threads (1MB/thread), virtual threads allow the system to handle thousands of concurrent Kafka events with minimal memory footprint—ideal for embedded environments.

Reactive Dashboard: Exposes a WebSocket API for real-time alert streaming, ensuring security analysts see threats as they happen.

⚙️ Optimization & "Embedded Awareness"
The project is specifically designed to run on resource-constrained hardware (e.g., TAI/ASELSAN edge devices).

Deterministic Resource Limiting: Tested under strict Docker constraints (cpus: 0.5, memory: 512M) to simulate embedded system conditions.

Memory Footprint Optimization: JVM tuning with custom Xmx and Xms flags to ensure stability without Garbage Collection (GC) overhead.

Benchmarking: Validated the performance gains of Virtual Threads over traditional threading models under restricted CPU cycles.

🛠️ Tech Stack
Language: Java 21 (Virtual Threads), Python 3.10

Streaming: Apache Kafka

Caching/Fast-State: Redis

Intelligence: Scikit-learn (Machine Learning)

Infrastructure: Docker & Docker Compose

Visualization: Spring Boot (WebSockets) & Next.js