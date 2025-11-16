# 🚗 SAFE-V: Smart Alert and Fire Emergency Vehicle System

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-blue)](https://safev.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![IoT](https://img.shields.io/badge/IoT-ESP32-red)](https://www.espressif.com/en/products/socs/esp32)
[![ThingSpeak](https://img.shields.io/badge/Cloud-ThingSpeak-orange)](https://thingspeak.com/)

> A real-time IoT-based system built to detect and respond to vehicle emergencies with smart alerts and interactive data monitoring.

## 🎯 Overview

**SAFE-V** is a dual-integrated emergency vigilance system combining two powerful modules:

### 🔍 MADAKSH
**Monitoring and Dashboard for Alcohol, Fire, and Temperature Sensor Health**

- 🍺 **Alcohol Detection**: Prevents drunk driving with real-time monitoring
- 🔥 **Fire Detection**: Instant alerts for in-vehicle fire hazards
- 🌡️ **Temperature Monitoring**: Tracks cabin heat levels
- 📊 **Live Dashboard**: Built with Next.js for responsive data visualization
- ✅ **Sensor Health Monitoring**: Logs sensor performance and status

### 🚨 AGNIVAR
**Alert Generation & Notification for Incidents via Vehicle Automated Response**

- 💥 **Accident Detection**: Vibration/tilt-based crash alerts
- ☢️ **Gas Leakage Monitoring**: Detects harmful gas presence
- 📱 **Instant Notifications**: Sent via Telegram and Email
- 🔒 **Secure APIs**: RESTful services ensure smooth and reliable backend operations

## ✨ Key Features

- 🔐 **Unique Vehicle-Specific Code-Based Access**
- ⚡ **Real-Time Emergency Alert System**
- 👤 **Role-Based Secure Login** (Spring Security 6)
- 📈 **Graphical Sensor Data Visualization**
- ☁️ **Cloud-Based Data Storage** (ThingSpeak)
- 🏗️ **Scalable and Modular Architecture**
- 📱 **Responsive UI with Cross-Platform Compatibility**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React Hooks
- **Charts**: Chart.js / Recharts
- **Deployment**: Vercel

### Backend
- **Framework**: Spring Boot
- **Security**: Spring Security 6
- **API**: RESTful Services
- **Authentication**: JWT-based
- **Language**: Java 17+

### Cloud & IoT Platform
- **IoT Cloud**: ThingSpeak
- **Data Storage**: ThingSpeak Channels
- **Real-time Communication**: ThingSpeak API
- **Data Visualization**: ThingSpeak Charts & Analytics

### Database
- **DBMS**: MySQL
- **ORM**: Spring Data JPA / Hibernate

### Hardware
- **Microcontroller**: ESP32
- **Sensors**:
  - MQ3 (Alcohol Detection)
  - MQ2 (Gas Detection)
  - Flame Sensor
  - Vibration Sensor
  - DHT11 (Temperature & Humidity)

### Notifications
- Telegram Bot API
- Email Service (SMTP)

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Java 17 or higher
- MySQL Server
- Arduino IDE (for ESP32 programming)
- ThingSpeak Account (Free tier available)

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/adityathodsare/safev.git
cd safev
```

#### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_THINGSPEAK_CHANNEL_ID=your_channel_id
NEXT_PUBLIC_THINGSPEAK_READ_API_KEY=your_read_api_key
```

Run the development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 3. Backend Setup

```bash
cd backend
./mvnw clean install
```

Update `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/safev_db
spring.datasource.username=your_username
spring.datasource.password=your_password

# ThingSpeak Configuration
thingspeak.api.url=https://api.thingspeak.com
thingspeak.channel.id=your_channel_id
thingspeak.write.api.key=your_write_api_key
thingspeak.read.api.key=your_read_api_key

# JWT Configuration
jwt.secret=your_secret_key
jwt.expiration=86400000

# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password

# Telegram Bot Configuration
telegram.bot.token=your_bot_token
telegram.bot.chat.id=your_chat_id
```

Run the backend:

```bash
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`

#### 4. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE safev_db;
```

#### 5. ThingSpeak Setup

1. Create a free account at [ThingSpeak.com](https://thingspeak.com/)
2. Create a new channel with the following fields:
   - Field 1: Alcohol Level (ppm)
   - Field 2: Gas Level (ppm)
   - Field 3: Temperature (°C)
   - Field 4: Humidity (%)
   - Field 5: Flame Status
   - Field 6: Vibration Status
3. Note down your Channel ID and API Keys (Write & Read)

#### 6. ESP32 Configuration

```cpp
// WiFi credentials
const char* ssid = "your_wifi_ssid";
const char* password = "your_wifi_password";

// ThingSpeak Configuration
unsigned long channelID = your_channel_id;
const char* writeAPIKey = "your_write_api_key";

// Backend API Configuration
const char* serverUrl = "http://your_backend_url/api/sensors/update";
```

- Install Arduino IDE
- Add ESP32 board support
- Install required libraries:
  - ThingSpeak by MathWorks
  - DHT sensor library
  - WiFi library
- Upload the firmware to ESP32

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

## 🔌 API Endpoints

### Authentication
```
POST /api/auth/login          - User login
POST /api/auth/register       - Register new user
POST /api/auth/logout         - User logout
GET  /api/auth/validate       - Validate JWT token
```

### Vehicle Monitoring
```
GET  /api/vehicle/{vehicleCode}     - Get vehicle details
POST /api/vehicle/register          - Register new vehicle
GET  /api/vehicle/status            - Get vehicle status
PUT  /api/vehicle/update            - Update vehicle info
```

### Sensor Data
```
GET  /api/sensors/data              - Get latest sensor data
POST /api/sensors/update            - Update sensor readings
GET  /api/sensors/history           - Get historical data
GET  /api/sensors/thingspeak        - Fetch from ThingSpeak
```

### Alerts
```
GET  /api/alerts/all                - Get all alerts
POST /api/alerts/create             - Create new alert
PUT  /api/alerts/acknowledge/{id}   - Acknowledge alert
DELETE /api/alerts/{id}             - Delete alert
```

### ThingSpeak Integration
```
GET  /api/thingspeak/channel        - Get channel info
GET  /api/thingspeak/feeds          - Get latest feeds
GET  /api/thingspeak/field/{id}     - Get specific field data
```

## 📱 Dashboard Features

- **Real-Time Monitoring**: Live sensor data visualization from ThingSpeak
- **Alert History**: View past emergency incidents
- **Vehicle Status**: Check current vehicle health
- **Analytics**: Graphical representation of sensor trends
- **Notifications Panel**: Manage alert preferences
- **ThingSpeak Charts**: Embedded real-time charts
- **Historical Data**: Access past sensor readings

## 🔔 Alert System

SAFE-V triggers alerts based on threshold values:

| Sensor | Threshold | Action |
|--------|-----------|--------|
| MQ3 (Alcohol) | > 400 ppm | Engine lock + Alert |
| MQ2 (Gas) | > 1000 ppm | Notification sent |
| Flame Sensor | Fire detected | Immediate alert |
| Temperature | > 60°C | Warning notification |
| Vibration | High impact | Accident alert |

## ☁️ ThingSpeak Integration

### Data Flow
1. **ESP32** reads sensor data
2. Data is sent to **ThingSpeak** cloud via HTTP/MQTT
3. **Spring Boot** backend fetches data from ThingSpeak API
4. **Next.js** frontend displays real-time data
5. Alerts are triggered based on threshold values

### ThingSpeak Features Used
- **Channel Data Storage**: Historical sensor readings
- **Field Charts**: Real-time visualization
- **MATLAB Analytics**: Data processing
- **REST API**: Data retrieval
- **Webhooks**: Alert triggers

### Sample ThingSpeak API Calls

```javascript
// Fetch latest sensor data
fetch(`https://api.thingspeak.com/channels/${channelId}/feeds.json?api_key=${readApiKey}&results=1`)

// Fetch specific field data
fetch(`https://api.thingspeak.com/channels/${channelId}/fields/1.json?api_key=${readApiKey}&results=100`)

// Write data to ThingSpeak
fetch(`https://api.thingspeak.com/update?api_key=${writeApiKey}&field1=${value}`)
```

## 🎓 Team

- **[Aditya Thodsare](https://github.com/adityathodsare)** - Full Stack Developer & Backend Lead
- **Khushi Sharma** - IoT & Hardware Integration
- **Kirti Shelke** - Frontend Developer

## 📂 Project Structure

```
safev/
├── frontend/
│   ├── components/
│   │   ├── Dashboard.jsx
│   │   ├── SensorChart.jsx
│   │   ├── AlertPanel.jsx
│   │   └── ThingSpeakWidget.jsx
│   ├── pages/
│   │   ├── index.js
│   │   ├── login.js
│   │   └── dashboard.js
│   ├── public/
│   ├── styles/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   ├── controller/
│   │   │   │   ├── service/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   └── config/
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
├── hardware/
│   ├── esp32_code/
│   │   ├── safev_main.ino
│   │   └── config.h
│   └── circuit_diagrams/
│       └── wiring_diagram.png
└── README.md
```

## 🔗 Links

- **🌐 Live Dashboard**: [https://safev.vercel.app](https://safev.vercel.app)
- **💻 Frontend Repository**: [GitHub - Frontend](https://github.com/adityathodsare/safev-frontend)
- **⚙️ Backend Repository**: [GitHub - Backend](https://github.com/adityathodsare/safev-backend)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Thanks to the open-source community for libraries and tools
- ThingSpeak by MathWorks for IoT cloud platform
- Espressif Systems for ESP32 platform
- Inspired by real-world vehicle safety challenges
- Built with passion to make every second count in emergencies

## 📞 Support

For questions or support:
- Open an [Issue](https://github.com/adityathodsare/safev/issues)
- Email: [your-email@example.com]

## 🌟 Show Your Support

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**"From observing real-world challenges to crafting a working system – this was more than a project. It was an aim to make every second count when it matters the most."**

---

Made with ❤️ by Team SAFE-V
