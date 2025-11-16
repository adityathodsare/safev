# 🚗 SAFE-V: Smart Alert and Fire Emergency Vehicle System

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-blue)](https://safev.vercel.app/)
[![IoT](https://img.shields.io/badge/IoT-ESP32-red)](https://www.espressif.com/en/products/socs/esp32)
[![ThingSpeak](https://img.shields.io/badge/Cloud-ThingSpeak-orange)](https://thingspeak.com/)

> A real-time IoT-based system for vehicle emergency detection with smart alerts and monitoring.

## 🎯 Overview

**SAFE-V** is a dual-module integrated emergency vigilance system:

### 🔍 MADAKSH
**Monitoring and Dashboard for Alcohol, Fire, and Temperature Sensor Health**
- Alcohol Detection (MQ3)
- Fire Detection (Flame Sensor)
- Temperature & Humidity Monitoring (DHT11)
- Real-time Dashboard

### 🚨 AGNIVAR
**Alert Generation & Notification for Incidents via Vehicle Automated Response**
- Accident Detection (Vibration Sensor)
- Gas Leakage Monitoring (MQ2)
- Instant Telegram & Email Alerts

## 🛠️ Tech Stack

- **Frontend**: Next.js
- **Backend**: Spring Boot + Spring Security 6
- **Database**: MySQL
- **IoT Cloud**: ThingSpeak
- **Hardware**: ESP32 Microcontroller
- **Sensors**: MQ3 (Alcohol), MQ2 (Gas), Flame, Vibration, DHT11 (Temperature)

## 📊 System Architecture

```
┌─────────────────┐
│   ESP32 + IoT   │
│    Sensors      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   ThingSpeak    │
│   Cloud IoT     │
│   Platform      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Spring Boot    │
│   Backend API   │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌────────┐ ┌──────────┐
│ MySQL  │ │ Next.js  │
│   DB   │ │ Frontend │
└────────┘ └────┬─────┘
              │
         ┌────┴────┐
         ▼         ▼
    ┌─────────┐ ┌──────┐
    │Telegram │ │Email │
    └─────────┘ └──────┘
```

## 🔔 How It Works

1. **ESP32** collects data from sensors (MQ3, MQ2, Flame, Vibration, DHT11)
2. Sensor data is sent to **ThingSpeak Cloud** for storage
3. **Spring Boot** backend fetches data via ThingSpeak API
4. Data is processed and stored in **MySQL** database
5. **Next.js** frontend displays real-time monitoring dashboard
6. Alert notifications sent via **Telegram** and **Email** when thresholds are exceeded

## 🚀 Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
./mvnw spring-boot:run
```

### ESP32 Setup
- Configure WiFi credentials
- Set ThingSpeak API keys
- Upload firmware to ESP32

## 🔗 Links

- **Live Dashboard**: [https://safev.vercel.app](https://safev.vercel.app)
- **Frontend Code**: [GitHub](https://github.com/adityathodsare/safev-frontend)
- **Backend Code**: [GitHub](https://github.com/adityathodsare/safev-backend)

## 📞 Contact

Email: thodsareaditya@gmail.com

---

Made with ❤️ by Aditya Thodsare
