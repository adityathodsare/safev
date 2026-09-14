# 🚗 SAFEV (Smart Accident Detection & Vehicle Safety System) — Complete Technical Documentation

> **Project Author:** Aditya Thodsare  
> **Platform Version:** SAFEV-AI Release (v0.1.0)  
> **Live Platform:** [safev.vercel.app](https://safev.vercel.app)  
> **Primary Repository:** [adityathodsare/safev](https://github.com/adityathodsare/safev)  

---

## 📌 Executive Summary

**SAFEV** is an enterprise-grade, end-to-end IoT, Computer Vision, and AI-driven vehicle intelligence & safety system. It bridges physical microcontroller hardware embedded in vehicles with cloud microservices, deep-learning vision pipelines, real-time spatial mapping, and an interactive Next.js web application.

The platform provides continuous real-time monitoring across five critical safety vectors:
1. **MADAKSH Telemetry**: Drunk driving detection, Blood Alcohol Content (BAC) tracking, and automatic engine ignition interlock relay triggering.
2. **AGNIVAR Telemetry**: Impact, G-force, vehicle inversion (tilt), collision jerk detection, and inflammable gas (LPG/CNG) leak monitoring.
3. **Internal Cabin ML Vision**: YOLOv8-powered cabin monitoring for occupant counting, seatbelt compliance enforcement, passenger overload alerts, and security snapshot archiving.
4. **External Road Vision**: Traffic light recognition, external road hazard detection, and path trajectory monitoring.
5. **RAKSHAK AI Copilot & Path-Based GPS**: Google Gemini AI integrated assistant for real-time emergency routing, facility location (Hospitals, Police, Mechanics, Fuel), and dynamic Leaflet map polyline path tracing.

---

## 🏗️ System Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      🔩 HARDWARE IOT LAYER (ESP32)                     │
│  MQ-3 (Alcohol) · MQ-2/6 (Gas) · Flame Sensor · MPU-6050 (Tilt/Gyro)    │
│            SW-420 (Vibration/Impact) · NEO-6M GPS Module               │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ HTTP REST / Webhooks
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     📡 IOT CLOUD (ThingSpeak)                            │
│  Channel 3407232 (MADAKSH) · Channel 3178329 (AGNIVAR) · Live Analytics │
└──────────────────────┬──────────────────────────────────┬───────────────┘
                       │                                  │
                       ▼                                  ▼
┌─────────────────────────────────────────┐  ┌─────────────────────────────┐
│ ⚙️ Spring Boot Alert Backend            │  │ 🧠 FastAPI ML Engine        │
│ ├─ JavaMailSender (SMTP Alerts)         │  │ ├─ YOLOv8 Cabin Vision      │
│ ├─ Telegram Bot API Notifications       │  │ ├─ Seatbelt Detection       │
│ └─ Multi-channel Emergency Dispatch     │  │ └─ External Traffic Vision  │
└──────────────────────┬──────────────────┘  └──────────────┬──────────────┘
                       └────────────────┬───────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      🖥️ NEXT.JS 16 FRONTEND WEB APP                     │
│   React 19 · Turbopack · Tailwind CSS · Motion · Leaflet · Recharts     │
│       Google Gemini AI (`@google/genai`) · UCOD Device Guard Security   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Complete Dependencies Breakdown (`package.json`)

| Package / Module | Version | Category | Technical Purpose & Usage Details |
|---|---|---|---|
| `@google/genai` | `^2.16.0` | AI / LLM SDK | Integrates Google Gemini AI into serverless API routes (`/api/ai-assistant`) powering the **RAKSHAK AI Copilot** for intelligent natural language assistance, emergency routing, and structured facility responses. |
| `next` | `^16.1.1` | Web Framework | Core Next.js 16 framework leveraging App Router, Turbopack fast builds, React Server Components, and API Route Handlers. |
| `react` & `react-dom` | `^19.2.3` | UI Core | React 19 engine enabling concurrent rendering, hooks (`useMemo`, `useCallback`, `useEffect`), and responsive state updates. |
| `leaflet` | `^1.9.4` | Mapping | Open-source interactive map library driving the vehicle tracking dashboard (`/track`) for displaying live GPS coordinates, polyline path history, custom map pins, and spatial boundaries. |
| `recharts` | `^2.15.1` | Data Visualization | Composable React SVG charting library rendering real-time telemetry line charts in `/alcoholtrack` and `/accidenttrack` for sensor metrics (BAC, G-force, temperature, humidity). |
| `chart.js` & `react-chartjs-2` | `^4.4.8` / `^5.3.0` | Data Visualization | Canvas-based charting suite for rendering complex historical analytics, sensor distributions, and cabin occupancy histograms. |
| `motion` (Framer Motion) | `^12.5.0` | Animation Engine | Production-grade animation library driving page transitions, smooth card entries, modal dialogs, spring physics, and glassmorphism UI micro-interactions. |
| `@stomp/stompjs` & `stompjs` | `^7.1.0` / `^2.3.3` | WebSockets | STOMP protocol clients establishing persistent WebSocket connections with backend microservices for low-latency alerts and sensor streams. |
| `sockjs-client` | `^1.6.1` | WebSockets | Fallback transport protocol ensuring WebSocket compatibility across strict network proxies and older browser environments. |
| `axios` | `^1.8.4` | HTTP Client | Promise-based HTTP client for calling external REST APIs, backend microservices, and IoT endpoints. |
| `clsx` & `tailwind-merge` | `^2.1.1` / `^3.0.2` | CSS Utilities | Merges Tailwind CSS utility classes dynamically without precedence conflicts (`cn()` helper in `src/lib/utils.ts`). |
| `lucide-react` | `^0.525.0` | Icons | Comprehensive, lightweight icon set used throughout headers, dashboards, status indicators, and control buttons. |
| `@tabler/icons-react` & `react-icons` | `^3.31.0` / `^5.5.0` | Icons | Specialized icons for vehicle dashboard gauges, warning alerts, fuel indicators, and sensor icons. |
| `@types/react-syntax-highlighter` & `react-syntax-highlighter` | `^15.5.13` / `^15.6.1` | Developer UI | Syntax highlighter component rendering formatted code blocks inside technical documentation components (`code-block.tsx`). |
| `@vercel/analytics` | `^2.0.1` | Analytics | Real-time performance monitoring and web telemetry for production deployment on Vercel. |
| `mini-svg-data-uri` | `^1.4.4` | Styling Helper | Converts inline SVG graphics into optimized data URIs for CSS background patterns and beams. |
| `simplex-noise` | `^4.0.3` | Canvas Graphics | Algorithmic noise generator producing smooth wave physics for interactive visual background components (`wavy-background.tsx`). |
| `react-element-to-jsx-string` | `^17.0.0` | Developer UI | Serializes React component trees into clean JSX strings for live code preview components. |
| `react-intersection-observer` | `^9.16.0` | Viewport Trigger | React hook triggering animations and lazy data fetches when components enter the browser viewport. |
| `tailwindcss` & `@tailwindcss/postcss` | `^4` | Styling Engine | Utility-first CSS framework v4 powering the entire responsive, dark-mode-first design system. |
| `typescript` | `^5` | Type Safety | Static type checker enforcing interfaces, API payload types, and component prop validation. |

---

## 📂 Source Code Structure & Module Details (`src/`)

### 1. App Pages (`src/app/`)

- **[layout.tsx](file:///home/aditya/Desktop/safev/safev/src/app/layout.tsx)**: Root HTML & Body wrapper. Configures Geist font family, light/dark inline theme script, Vercel Analytics, SEO metadata, OpenGraph tags, favicons, and wraps the app with `ThemeProvider`, `NavigationProvider`, `UcodProvider`, `Navbar`, and `AuthProvider`.
- **[page.tsx](file:///home/aditya/Desktop/safev/safev/src/app/page.tsx)**: Public landing page showcasing the interactive Hero section, feature grids, creator profile, hardware blueprints, and quick navigation actions.
- **[rakshak/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/rakshak/page.jsx)**: **RAKSHAK Emergency AI Copilot Dashboard**. Features conversational AI chat interface connected to `/api/ai-assistant`, direct location query buttons (Hospitals, Police Stations, Mechanics, Petrol Pumps, Pharmacies), interactive Leaflet mini-map, route calculation to safe havens, and emergency call shortcuts. Protected by `UcodGuard`.
- **[alcoholtrack/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/alcoholtrack/page.jsx)**: **MADAKSH Drunk Driving Telemetry Page**. Fetches live MQ-3 sensor streams from ThingSpeak Channel `3407232` (API key `UFVCOV4G37H5S9HN`). Displays real-time Blood Alcohol Content (BAC), cabin temperature, relative humidity, fire state, and engine ignition interlock relay status. Renders live wave line charts using Recharts. Protected by `UcodGuard`.
- **[accidenttrack/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/accidenttrack/page.jsx)**: **AGNIVAR Accident & Crash Sensor Page**. Fetches live crash data from ThingSpeak Channel `3178329` (API key `6FP5OUS42Y6AQ7BW`). Monitors 3-axis G-force, impact force, jerk index, vehicle roll/pitch tilt angle (MPU-6050), MQ-2 gas leakage, and automated crash alert activation. Protected by `UcodGuard`.
- **[track/page.tsx](file:///home/aditya/Desktop/safev/safev/src/app/track/page.tsx)**: **Live GPS Tracking & Route Pathing Engine**. Full-screen Leaflet interactive map displaying real-time vehicle markers, historical route pathing polylines, current speed (km/h), heading direction, altitude, spatial accuracy radius, emergency drawer panel, and direct navigation links. Protected by `UcodGuard`.
- **[tracking/page.tsx](file:///home/aditya/Desktop/safev/safev/src/app/tracking/page.tsx)**: **Device Authorization Login**. Clean authentication portal where users input their Unique Device Code (UCOD) to unlock live vehicle telemetry.
- **[tracking/choose/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/tracking/choose/page.jsx)**: Security portal hub displayed post-login, letting users select between GPS tracking, alcohol telemetry, accident telemetry, or camera feeds.
- **[tracking/error/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/tracking/error/page.jsx)**: Authorization failure screen informing users of invalid UCOD entry with retry options.
- **[internal-camera/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/internal-camera/page.jsx)**: **Cabin Vision Computer Vision Dashboard**. Connects to the Python FastAPI ML engine (`API_BASE_URL`). Polls `/latest`, `/captures/list`, and `/analysis/stats` to render live video overlay, passenger counts, seatbelt compliance badges, overload alarms, snapshot image galleries, and downloadable archive logs. Protected by `UcodGuard`.
- **[external-camera/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/external-camera/page.jsx)**: **External Road Vision Page**. Monitors traffic light colors, vehicle distance, forward collision warnings, and road conditions via external camera streams. Protected by `UcodGuard`.
- **[prototype/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/prototype/page.jsx)**: Technical showcase featuring the YouTube prototype video demonstration (`22hU7Eip-ag`), interactive hardware gallery carousel, ESP32 hardware wiring diagrams, pin connections, sensor datasheets, and physical module architecture.
- **[buy/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/buy/page.jsx)**: E-commerce hardware selection page for ordering SAFEV IoT device kits.
- **[confirmPurchase/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/confirmPurchase/page.jsx)**: Order review & shipping details confirmation screen.
- **[success/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/success/page.jsx)**: Order success confirmation page with UCOD generation and setup instructions.
- **[contact/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/contact/page.jsx)**: Support and contact form for technical assistance or emergency support queries.
- **[register/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/register/page.jsx)**: User account creation and vehicle device pairing form.
- **[logout/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/logout/page.jsx)**: Clears `sessionStorage` UCOD tokens and resets state to logged out.
- **[remaining/page.jsx](file:///home/aditya/Desktop/safev/safev/src/app/remaining/page.jsx)**: Roadmap overview displaying upcoming engineering updates and extensions.

---

### 2. API Routes (`src/app/api/`)

- **[ai-assistant/route.ts](file:///home/aditya/Desktop/safev/safev/src/app/api/ai-assistant/route.ts)**:
  - Enterprise Next.js API endpoint powering **RAKSHAK Copilot**.
  - Connects to Google Gemini (`@google/genai`) using `GEMINI_API_KEY`.
  - Integrates OpenStreetMap (Nominatim & Overpass APIs) to search real-world coordinates for emergency services (Hospitals, Police, Fire, Fuel, Mechanics, Pharmacies).
  - Implements Haversine distance spatial ranking, filtering out non-emergency places (temples, landuse, water bodies).
  - Returns structured JSON payloads containing recommended emergency facilities, distance in km, direct phone numbers, and maps URLs.

- **[ai-route/route.ts](file:///home/aditya/Desktop/safev/safev/src/app/api/ai-route/route.ts)**:
  - Routing engine endpoint querying Open Source Routing Machine (OSRM) driving API.
  - Takes `originLat`, `originLng`, `destLat`, `destLng` coordinates and calculates optimal turn-by-turn route geometry, driving distance in km, and duration in minutes.
  - Features Haversine fallback calculation if external OSRM services are unreachable.

---

### 3. Context Providers (`src/context/`)

- **[UcodContext.tsx](file:///home/aditya/Desktop/safev/safev/src/context/UcodContext.tsx)**:
  - Manages vehicle security authorization using Unique Code (UCOD).
  - Validates user input against `MHXXRTXXXX` (default user `adityathodsare`).
  - Persists valid credentials in `sessionStorage` (`safev_ucod`, `safev_username`).
  - Exposes `validateUcod()`, `clearUcod()`, `isValidated`, and `isChecking`.

- **[AuthContext.js](file:///home/aditya/Desktop/safev/safev/src/context/AuthContext.js)**:
  - Global authentication context holding current user session state, registration data, and profile info.

- **[ThemeContext.tsx](file:///home/aditya/Desktop/safev/safev/src/context/ThemeContext.tsx)**:
  - Controls Light / Dark theme state.
  - Toggles the `dark` CSS class on `document.documentElement` and synchronizes preference with `localStorage`.

- **[NavigationContext.js](file:///home/aditya/Desktop/safev/safev/src/context/NavigationContext.js)**:
  - Provides progress bar loading animation during page transitions via `navigateWithLoader()`.

---

### 4. Components & UI Elements (`src/components/`)

#### Security & Auth:
- **[UcodGuard.jsx](file:///home/aditya/Desktop/safev/safev/src/components/auth/UcodGuard.jsx)**: Security wrapper that protects confidential telemetry pages (`/track`, `/alcoholtrack`, `/accidenttrack`, `/internal-camera`, `/external-camera`, `/rakshak`). Displays a glassmorphic authorization screen with sample demo code `MHXXRTXXXX` if unauthenticated and automatically redirects to `/tracking`.

#### UI Controls (`src/components/ui/`):
- **[Navbar.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/Navbar.tsx)**: Header navigation bar with blur glassmorphism, responsive desktop & mobile drawer menu, active route indicators, theme toggle, and live UCOD authorization status badge.
- **[ThemeToggle.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/ThemeToggle.tsx)**: Interactive button toggling Sun/Moon icons for Light and Dark modes.
- **[PageLoader.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/PageLoader.tsx)**: Top bar progress loader rendered during client navigation.
- **[background-beams-with-collision.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/background-beams-with-collision.tsx)**: Dynamic SVG beam collisions for landing page visual flare.
- **[background-beams.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/background-beams.tsx)**: Background glowing gradient beams.
- **[background-lines.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/background-lines.tsx)**: SVG animated background lines grid.
- **[wavy-background.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/wavy-background.tsx)**: Simplex noise interactive HTML5 canvas wave background.
- **[animated-tooltip.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/animated-tooltip.tsx)**: Animated hover tooltips with scale and tilt spring effects.
- **[carousel.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/carousel.tsx)**: Touch-friendly image and content slide carousel.
- **[code-block.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/code-block.tsx)**: Syntax-highlighted code block renderer for code samples and documentation.
- **[flip-words.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/flip-words.tsx)**: Smooth word cycling text animation component.
- **[sticky-scroll-reveal.tsx](file:///home/aditya/Desktop/safev/safev/src/components/ui/sticky-scroll-reveal.tsx)**: Sticky container scrolling component that transitions feature text alongside image updates.

#### Landing & Feature Sections (`src/components/`):
- **[Features.jsx](file:///home/aditya/Desktop/safev/safev/src/components/Features.jsx)**: Interactive feature grid explaining MADAKSH, AGNIVAR, RAKSHAK AI, and IoT Cloud integrations.
- **[WhySafev.jsx](file:///home/aditya/Desktop/safev/safev/src/components/WhySafev.jsx)**: Problem statement highlighting accident statistics, emergency response latency, and SAFEV solution benefits.
- **[TechStack.jsx](file:///home/aditya/Desktop/safev/safev/src/components/TechStack.jsx)**: Detailed tabbed showcase of hardware, backend, ML engines, cloud infrastructure, and frontend technologies.
- **[HowToUseGuide.jsx](file:///home/aditya/Desktop/safev/safev/src/components/HowToUseGuide.jsx)**: Step-by-step installation and user onboarding guide.
- **[DevelopedBy.jsx](file:///home/aditya/Desktop/safev/safev/src/components/DevelopedBy.jsx)**: Profile of system creator **Aditya Thodsare**, detailing technical skills, GitHub credentials, and engineering achievements.
- **[Creatorsection.jsx](file:///home/aditya/Desktop/safev/safev/src/components/Creatorsection.jsx)**: Hero section showcasing creator background and social links.
- **[UpcomingFeatures.jsx](file:///home/aditya/Desktop/safev/safev/src/components/UpcomingFeatures.jsx)**: SAFEV Future roadmap cards (OBD-II telemetry, fatigue monitor, drone dispatch).
- **[Footer.tsx](file:///home/aditya/Desktop/safev/safev/src/components/Footer.tsx)**: Universal page footer with quick links, live status indicator, and copyright information.

---

### 5. Services & Configuration (`src/lib/` & `src/services/`)

- **[config.ts](file:///home/aditya/Desktop/safev/safev/src/lib/config.ts)**: Configures API endpoints:
  - `API_BASE_URL`: `http://localhost:8080` (or `NEXT_PUBLIC_API_URL`)
  - `CAMERA_API_URL`: `http://localhost:8000` (or `NEXT_PUBLIC_CAMERA_API_URL`)
- **[utils.ts](file:///home/aditya/Desktop/safev/safev/src/lib/utils.ts)**: Provides the `cn()` helper combining `clsx` and `tailwind-merge`.
- **[authService.js](file:///home/aditya/Desktop/safev/safev/src/services/authService.js)**: Handles registration HTTP requests to backend services.

---

## 🌐 External Microservices & Repositories Ecosystem

| Module | Repository Link | Tech Stack | Responsibility & Integration Details |
|---|---|---|---|
| 💻 **Frontend Web App** | [adityathodsare/safev](https://github.com/adityathodsare/safev) | Next.js 16, React 19, Tailwind CSS, Turbopack | Main user-facing web dashboard, Leaflet GPS tracking, charts, RAKSHAK AI copilot, UCOD security gating. |
| 🧠 **Internal Cam ML Engine** | [adityathodsare/safev-internal-cam-ML](https://github.com/adityathodsare/safev-internal-cam-ML) | Python 3.10+, FastAPI, YOLOv8, OpenCV | Asynchronous computer vision server processing webcam and ESP32-CAM HTTP image streams for passenger counting, seatbelt detection, overload alerts, and snapshot archiving (`/latest`, `/captures/list`). |
| 👁️ **External Cam ML Engine** | [adityathodsare/SAFEV-external-cam-ML](https://github.com/adityathodsare/SAFEV-external-cam-ML) | Python, OpenCV, Computer Vision | Road safety engine detecting traffic light states, forward obstacles, and lane drift. |
| 📷 **Traffic Light Dataset** | [adityathodsare/safev-traffic-light-external-cam-data](https://github.com/adityathodsare/safev-traffic-light-external-cam-data) | Datasets, YOLO Weights | Dataset and trained vision weights for traffic signal state classification. |
| ⚙️ **Backend Alert Server** | [adityathodsare/backend-safe-mails](https://github.com/adityathodsare/backend-safe-mails) | Java 17, Spring Boot, JavaMailSender, Telegram Bot API | Microservice sending immediate automated emergency emails (SMTP) and Telegram messages with GPS coordinates whenever crash or high BAC alerts trigger. |
| 🔩 **IoT Firmware Module** | [adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module](https://github.com/adityathodsare/SAFE-V_MADAKSH_AND_AGNIVAR_module) | C++, Arduino IDE, ESP32 Microcontroller | Embedded firmware acquiring raw readings from MQ-3, MQ-2/6, Flame sensor, MPU-6050, SW-420, and NEO-6M GPS, transmitting JSON payloads over HTTP/MQTT to ThingSpeak channels `3407232` and `3178329`. |
| 🧪 **QA Automation Suite** | [adityathodsare/safev-qa-automation-framework](https://github.com/adityathodsare/safev-qa-automation-framework) | Node.js, Playwright | Automated end-to-end testing suite validating user workflows, UI responsiveness, UCOD authentication, and API endpoints. |

---

## 🔩 IoT Hardware Telemetry Mapping

### 1. MADAKSH Module (ThingSpeak Channel `3407232`)
- **Field 1 (`temperature`)**: Vehicle cabin ambient temperature (°C).
- **Field 2 (`humidity`)**: Cabin relative humidity percentage (%).
- **Field 3 (`alcoholLevel`)**: MQ-3 analog sensor reading (Blood Alcohol Content estimation).
- **Field 4 (`fireDetected`)**: Optical Flame Sensor digital signal (Inverted logic: `0` = Fire Present, `1` = Safe).
- **Field 5 (`engineAllowed`)**: Relays signal to physical starter motor (`1` = Allowed, `0` = Engine Cutoff triggered due to intoxication).

### 2. AGNIVAR Module (ThingSpeak Channel `3178329`)
- **Field 1 (`gforce`)**: Linear acceleration G-force vector calculated from MPU-6050 accelerometer.
- **Field 2 (`impact`)**: SW-420 vibration sensor impact intensity value.
- **Field 3 (`jerk`)**: Rate of change of acceleration (dG/dt) indicating collision abruptness.
- **Field 4 (`tilt`)**: Vehicle orientation angle in degrees (detects vehicle roll-over / inversion).
- **Field 5 (`gas`)**: MQ-2/MQ-6 gas sensor reading monitoring combustible gas leakages (LPG/CNG).
- **Field 6 (`alert`)**: Master emergency trigger flag (`1` = Crash detected, triggers Telegram & Email emergency alerts).

---

## 🐳 Deployment & Containerization

### Docker Containerization (`Dockerfile`)
The frontend is containerized using multi-stage Node.js build steps:
```dockerfile
# Build image locally
docker build -t safev-frontend:latest .

# Run container locally on port 3000
docker run -p 3000:3000 -e GEMINI_API_KEY="your_api_key" safev-frontend:latest
```

### GitHub Container Registry (GHCR) Deployment
Published automatically on push to `main`:
```bash
docker pull ghcr.io/adityathodsare/safev:latest
docker run -p 3000:3000 ghcr.io/adityathodsare/safev:latest
```

### Live Vercel Production Environment
- **Live URL**: [safev.vercel.app](https://safev.vercel.app)
- **Deployment Platform**: Vercel Serverless Edge Network with Turbopack acceleration.

---

## 🛡️ Security Architecture: UCOD Guard System

Access to live telemetry, GPS map tracking, and camera streams is protected by the **UCOD (Unique Device Code)** security layer:
1. Every vehicle kit is provisioned with a unique alphanumeric code (Demo default: `MHXXRTXXXX`).
2. When navigating to protected routes (`/track`, `/alcoholtrack`, `/accidenttrack`, `/internal-camera`, `/external-camera`, `/rakshak`), `UcodGuard` intercepts request state.
3. If unauthorized, access is blocked with a glassmorphism shield UI and redirected to `/tracking`.
4. Successful validation stores `safev_ucod` and `safev_username` in `sessionStorage` to maintain session persistence.

---

<div align="center">

**SAFEV — Engineering Safer Roads Through IoT, Vision, and Artificial Intelligence**  
*Designed and Developed by [Aditya Thodsare](https://github.com/adityathodsare)*

</div>
