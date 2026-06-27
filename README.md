<div align="center">

# 🚗 SAFE-V
### IoT + Full Stack Cloud-Deployed Vehicle Safety System

[![Live App](https://img.shields.io/badge/🌐_Live_App-safev.vercel.app-black?style=for-the-badge)](https://safev.vercel.app)
[![Source Code](https://img.shields.io/badge/💻_Source-GitHub-181717?style=for-the-badge&logo=github)](https://github.com/adityathodsare/safev/)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=flat-square&logo=springboot&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![ESP32](https://img.shields.io/badge/ESP32-E7352C?style=flat-square&logo=espressif&logoColor=white)
![YOLOv8](https://img.shields.io/badge/YOLOv8-00FFFF?style=flat-square&logo=yolo&logoColor=black)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=flat-square&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)

> 🔍 Find on Google: **`safev IOT`** · **`safev aditya thodsare`**

</div>

---

## 📌 About

SAFE-V is a production-deployed vehicle safety platform that connects embedded IoT hardware, cloud AI, and a real-time web dashboard to monitor drivers and vehicles — firing instant alerts when danger is detected.

- 🔌 **IoT-based** vehicle monitoring platform using embedded systems, computer vision, cloud services, and microservices
- 🌐 **Scalable web platform** — Next.js frontend with Spring Boot & FastAPI microservices deployed on AWS
- 🚦 **YOLOv8-powered** traffic monitoring with traffic light recognition, passenger monitoring, and external vehicle vision
- 📊 **Real-time dashboards** visualizing GPS tracking, accident detection, alcohol monitoring, fire, gas leakage, tilt angle & speed
- 📡 **ESP32 + ThingSpeak** integration for live sensor streaming and historical analytics
- 🔔 **Automated Email & Telegram** notifications for emergency events with live vehicle route history

---

## 🔗 Project Links

| | Module | Link |
|:---:|---|---|
| 🌐 | Live App | [safev.vercel.app](https://safev.vercel.app) |
| 💻 | Frontend | [adityathodsare/safev](https://github.com/adityathodsare/safev) |
| ⚙️ | Backend — Email Service | [adityathodsare/backend-safe-mails](https://github.com/adityathodsare/backend-safe-mails) |
| 🔩 | Hardware — MADAKSH & AGNIVAR | [adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module](https://github.com/adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module) |
| 📷 | Internal Camera System | [adityathodsare/safev-traffic-light-external-cam-data](https://github.com/adityathodsare/safev-traffic-light-external-cam-data) |
| 🧠 | Internal Cam ML | [adityathodsare/safev-internal-cam-ML](https://github.com/adityathodsare/safev-internal-cam-ML) |
| 👁️ | External Cam ML | [adityathodsare/SAFEV-external-cam-ML](https://github.com/adityathodsare/SAFEV-external-cam-ML) |
| 🧪 | QA Automation (Playwright) | [adityathodsare/safev-qa-automation-framework](https://github.com/adityathodsare/safev-qa-automation-framework) |
| ☁️ | Backend Public API | [32.194.140.137:8080](http://32.194.140.137:8080/) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    🔩 HARDWARE LAYER                         │
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
│  ├─ Email Alerts (SMTP) │   │   ├─ YOLOv8 Traffic Lights    │
│  ├─ Telegram Bot        │   │   ├─ External Cam Analytics    │
│  ├─ Data Persistence    │   │   └─ Internal Cam / Drowsiness │
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
              │   ├─ Live GPS Map             │
              │   ├─ Alert History            │
              │   └─ Camera Feed Viewer       │
              │   Deployed on: Vercel         │
              └───────────────────────────────┘

☁️  AWS EC2 · Docker Compose · VPC · Elastic IP · CloudWatch
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| 🔩 Hardware | ESP32 · MQ-3 · MQ-2/6 · Flame Sensor · SW-420 · MPU-6050 · NEO-6M GPS |
| 📡 IoT Cloud | ThingSpeak |
| ⚙️ Backend | Spring Boot (Java) · Python FastAPI · YOLOv8 |
| 🖥️ Frontend | Next.js · WebSocket |
| 🗄️ Database | MySQL · PostgreSQL |
| ☁️ Infra | AWS EC2 · Docker · Vercel · CloudWatch |
| 🔔 Alerts | Telegram Bot API · JavaMailSender (SMTP) |
| 🧪 QA | Playwright |

---

<div align="center">

**Built by [Aditya Thodsare](https://github.com/adityathodsare)**

*If this project helped you, drop a ⭐*

</div>
