# 🚗 SAFE-V: Smart Alert and Fire Emergency Vehicle System

[![Live Dashboard](https://img.shields.io/badge/Live-Dashboard-blue)](https://safev.vercel.app/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![IoT](https://img.shields.io/badge/IoT-ESP32-red)](https://www.espressif.com/en/products/socs/esp32)

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
- 🏗️ **Scalable and Modular Architecture**
- 📱 **Responsive UI with Cross-Platform Compatibility**

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js
- **Styling**: Tailwind CSS / CSS Modules
- **State Management**: React Hooks
- **Charts**: Chart.js / Recharts

### Backend
- **Framework**: Spring Boot
- **Security**: Spring Security 6
- **API**: RESTful Services
- **Authentication**: JWT-based

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
npm run dev
```

The frontend will run on `http://localhost:3000`

#### 3. Backend Setup

```bash
cd backend
./mvnw clean install
./mvnw spring-boot:run
```

The backend will run on `http://localhost:8080`

#### 4. Database Configuration

Create a MySQL database:

```sql
CREATE DATABASE safev_db;
```

Update `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/safev_db
spring.datasource.username=your_username
spring.datasource.password=your_password
```

#### 5. ESP32 Configuration

- Install Arduino IDE
- Add ESP32 board support
- Install required sensor libraries
- Upload the firmware to ESP32
- Configure WiFi credentials in the code

## 📊 System Architecture

```
┌─────────────────┐
│   ESP32 + IoT   │
│    Sensors      │
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
└────────┘ └──────────┘
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
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Vehicle Monitoring
```
GET  /api/vehicle/{vehicleCode}
POST /api/vehicle/register
GET  /api/vehicle/status
```

### Sensor Data
```
GET  /api/sensors/data
POST /api/sensors/update
GET  /api/sensors/history
```

### Alerts
```
GET  /api/alerts/all
POST /api/alerts/create
PUT  /api/alerts/acknowledge
```

## 📱 Dashboard Features

- **Real-Time Monitoring**: Live sensor data visualization
- **Alert History**: View past emergency incidents
- **Vehicle Status**: Check current vehicle health
- **Analytics**: Graphical representation of sensor trends
- **Notifications Panel**: Manage alert preferences

## 🔔 Alert System

SAFE-V triggers alerts based on threshold values:

| Sensor | Threshold | Action |
|--------|-----------|--------|
| MQ3 (Alcohol) | > 400 ppm | Engine lock + Alert |
| MQ2 (Gas) | > 1000 ppm | Notification sent |
| Flame Sensor | Fire detected | Immediate alert |
| Temperature | > 60°C | Warning notification |
| Vibration | High impact | Accident alert |

## 🎓 Team

- **[Aditya Thodsare](https://github.com/adityathodsare)** - Full Stack Developer
- **Khushi Sharma** - IoT & Hardware Integration
- **Kirti Shelke** - Frontend Developer

## 📂 Project Structure

```
safev/
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── public/
│   ├── styles/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
├── hardware/
│   ├── esp32_code/
│   └── circuit_diagrams/
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
