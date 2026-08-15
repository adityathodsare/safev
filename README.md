<div align="center">

# 🚗 SAFE-V (SAFEV-AI Release)
### IoT + Full-Stack Cloud-Deployed Vehicle Safety & AI Copilot Suite

[![Live App](https://img.shields.io/badge/🌐_Live_App-safev.vercel.app-black?style=for-the-badge)](https://safev.vercel.app)
[![Source Code](https://img.shields.io/badge/💻_Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/adityathodsare/safev/)
[![Release](https://img.shields.io/badge/🚀_Release-SAFEV--AI-blue?style=for-the-badge)](#-whats-new-in-safev-ai-release)

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=nextdotjs)
![React 19](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Google Gemini](https://img.shields.io/badge/Google_Gemini_AI-8E75B2?style=flat-square&logo=google&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python_3.10+-3776AB?style=flat-square&logo=python&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8_Vision-00FFFF?style=flat-square&logo=yolo&logoColor=black)
![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=flat-square&logo=espressif&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

> 🔍 Find on Google: **`safev IOT`** · **`safev aditya thodsare`**

</div>

---

## 📌 About

**SAFE-V** is a production-deployed, end-to-end vehicle safety & intelligence platform engineered by **Aditya Thodsare**. It bridges embedded IoT hardware sensors, cloud microservices, computer vision models, and a modern Next.js web application to monitor driver state, cabin occupancy, external traffic, and vehicle metrics in real-time.

- 🔌 **Hardware IoT Ecosystem**: Live telemetry from ESP32 microcontrollers streaming alcohol, gas, fire, tilt, vibration, and GPS coordinates.
- 🤖 **RAKSHAK AI Copilot**: Emergency AI assistant integrated into the dashboard for driver navigation & hazard response.
- 👁️ **Internal Cabin AI Vision**: YOLOv8 + OpenCV pipeline for passenger counting, overload flags, and seatbelt detection via webcam or ESP32-CAM REST streams.
- 🚦 **External Traffic Vision**: Computer vision monitoring external road conditions and traffic light states.
- 📍 **Path-Based GPS Tracking**: Real-time vehicle location map rendering with historical route pathing.
- 🔔 **Emergency Alerting**: Instant multi-channel alerts delivered via Telegram Bot API and SMTP Email notifications.

---

## 🚀 What's New in SAFEV-AI Release

- 🤖 **RAKSHAK AI Suite**: Integrated Google Gemini (`@google/genai`) powered assistant into the central safety navigation portal.
- 🧠 **Internal Camera ML Upgrades**:
  - Implemented async-safe FastAPI detection loop handling both webcam and ESP32-CAM HTTP image payloads.
  - Added seatbelt detection heuristic combined with YOLOv8 person bounding boxes.
  - Added passenger overload threshold alerts and automated snapshot archiving.
- ⚡ **Real-Time `/latest` Endpoint & UI Integration**:
  - Backend telemetry endpoint (`/latest`, `/captures/list`, `/analysis/stats`) serving instantaneous driver monitor stats.
  - Frontend auto-refresh dashboard displaying live visual detection overlays, count metrics, and warning triggers.
- 🗺️ **Path-Based Vehicle Tracking**: Dynamic path tracing algorithm for Leaflet live map visualization.
- ⚡ **Next.js 16 + React 19 Upgrade**: High-performance dashboard rendering with Turbopack and modern UI motion transitions.

---

## 🔗 Project Architecture & Repositories

| | Module | Description & Repository Link |
|:---:|---|---|
| 🌐 | **Live Web Platform** | [safev.vercel.app](https://safev.vercel.app) |
| 💻 | **Frontend Dashboard** | [adityathodsare/safev](https://github.com/adityathodsare/safev) |
| 🧠 | **Internal Cam ML Engine** | [adityathodsare/safev-internal-cam-ML](https://github.com/adityathodsare/safev-internal-cam-ML) |
| 👁️ | **External Cam ML Engine** | [adityathodsare/SAFEV-external-cam-ML](https://github.com/adityathodsare/SAFEV-external-cam-ML) |
| 📷 | **Traffic Light Camera Data** | [adityathodsare/safev-traffic-light-external-cam-data](https://github.com/adityathodsare/safev-traffic-light-external-cam-data) |
| ⚙️ | **Email Alert Backend** | [adityathodsare/backend-safe-mails](https://github.com/adityathodsare/backend-safe-mails) |
| 🔩 | **IoT Hardware Firmware** | [adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module](https://github.com/adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module) |
| 🧪 | **QA Automation Suite** | [adityathodsare/safev-qa-automation-framework](https://github.com/adityathodsare/safev-qa-automation-framework) |
| ☁️ | **Backend Public API** | [32.194.140.137:8080](http://32.194.140.137:8080/) |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🔩 HARDWARE LAYER                        │
│         ESP32 · Sensors · GPS · Camera Module               │
│  🍺 Alcohol  💨 Gas  🔥 Fire  💥 Vibration  📐 Tilt  📍 GPS │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP / MQTT
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                  📡 IOT CLOUD — ThingSpeak                   │
│          Live sensor ingestion · REST API · Analytics        │
└─────────────┬───────────────────────────────┬───────────────┘
              │                               │
              ▼                               ▼
┌─────────────────────────┐   ┌───────────────────────────────┐
│  ⚙️  Spring Boot API     │   │   🧠 FastAPI AI Service        │
│  ├─ Email Alerts (SMTP) │   │   ├─ YOLOv8 Passenger & Seatbelt  │
│  ├─ Telegram Bot        │   │   ├─ External Cam Analytics       │
│  ├─ Data Persistence    │   │   └─ AI Copilot (Gemini API)      │
│  └─ Storage Service     │   └───────────────────────────────┘
└──────────────┬──────────┘                   │
               └──────────────┬───────────────┘
                              ▼
              ┌───────────────────────────────┐
              │     🗄️  MySQL / PostgreSQL      │
              └───────────────┬───────────────┘
                              ▼
              ┌───────────────────────────────┐
              │   🖥️  Next.js Dashboard        │
              │   ├─ Real-time Sensor Gauges  │
              │   ├─ Path-Based GPS Map       │
              │   ├─ RAKSHAK AI Suite         │
              │   └─ Live Internal Cam Feed   │
              │   Deployed on: Vercel         │
              └───────────────────────────────┘

☁️  AWS EC2 · Docker Compose · VPC · Elastic IP · CloudWatch
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| 🔩 **Hardware** | ESP32 Microcontroller · MQ-3 (Alcohol) · MQ-2/6 (Gas) · Flame Sensor · SW-420 (Vibration) · MPU-6050 (Tilt/Gyro) · NEO-6M GPS |
| 📡 **IoT Streaming** | ThingSpeak REST APIs & Webhooks |
| 🧠 **AI & Vision** | YOLOv8 (Ultralytics) · OpenCV · Python 3.10+ · FastAPI · Google Gemini AI (`@google/genai`) |
| ⚙️ **Backend** | Java 17 Spring Boot · FastAPI · Uvicorn |
| 🖥️ **Frontend** | Next.js 16 (Turbopack) · React 19 · Tailwind CSS · Motion · Leaflet Maps · Chart.js / Recharts |
| 🗄️ **Database** | MySQL / PostgreSQL |
| ☁️ **Cloud & Infra** | AWS EC2 · Docker & Docker Compose · Vercel Deployment |
| 🔔 **Alerting** | Telegram Bot API · JavaMailSender (SMTP) |
| 🧪 **Testing** | Playwright E2E Test Framework |

---
---

<div align="center">

**Designed & Developed by [Aditya Thodsare](https://github.com/adityathodsare)**

*If you find SAFE-V useful, please consider giving it a ⭐ on GitHub!*

</div>
