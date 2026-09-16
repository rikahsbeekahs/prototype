# 🌦️ Mausam Mitra (मौसम मित्र) — AI-Personalized Weather Companion

> **Smart India Hackathon (SIH) Problem Statement ID:** `26076`  
> **Title:** Development of personalized homepage for 'Mausam' mobile application  
> **Organization:** Ministry of Earth Sciences (MoES)  
> **Department:** India Meteorological Department (IMD)  
> **Theme:** Smart Automation  

---

## 📌 Executive Summary

Mausam Mitra transforms the existing Government of India **Mausam** ecosystem into an intelligent, accessible, and personalized weather experience tailored to **8 distinct citizen personas**.

Powered by **Megha (मेघा)** — an empathetic AI avatar companion who speaks Hindi and English, lip-syncs naturally in real-time, and navigates the interface via voice commands — Mausam Mitra bridges complex meteorological observations with everyday life.

---

## 🌟 Key Features

### 1. 👥 8 Official Personas (Strictly as per MoES/IMD PS 26076)
- 🌿 **Health-conscious:** Real-time AQI Speedometer (PM2.5/PM10), Pollen Count, UV Index gauge, Humidity slider, and Asthma/Allergy advisories.
- 🏃 **Outdoor Fitness:** Optimal running hour windows (e.g. 5:45 – 7:30 AM), Sunrise/Sunset celestial arc, Wind speed, and Heat stress warnings.
- 🏄 **Beachgoers & Surfers:** High/Low tide charts, Wave swell height (meters), Coastal water temperature, and Rip current safety status.
- ✈️ **Travelers:** Multi-city saved destinations, Airport weather delay risk %, and Smart context-aware packing checklists.
- 👨‍👩‍👧 **Parents & Families:** Morning school commute (7:00 – 9:00 AM) weather safety, Rain & thunderstorm probability, and Playground UV warnings.
- 🌾 **Agriculture & Gardeners:** Volumetric Soil Moisture (VWC %), 5-day rainfall predictions (mm), Ground frost warnings, and Agromet crop sowing guidance.
- 🚗 **Commuters:** Weather-traffic integration, Transit visibility (km / fog index), and Highway crosswind/waterlogging alerts.
- 🎉 **Event Planners:** Extended 7–14 day forecasts, Probability of rain %, and Outdoor gathering comfort index.
- 🌐 **General View Mode:** Dedicated 1-tap toggle to view standard IMD meteorological observations without persona filters.

### 2. 🤖 Megha (मेघा) — The AI Avatar Companion
- **Real-Time Lip-Sync Talking Mouth Animation:** Seamlessly toggles between neutral smiling state (`megha_idle_transparent.png`) and open-mouth speaking state (`megha_speaking_transparent.png`) synchronized with Web Speech synthesis.
- **Voice Welcome Onboarding:** Greets users warmly upon app open:
  > *"Namaste! Main Megha hoon, aapki Mausam Mitra. Aaj aap Mausam app ka prayog kis roop me karna chahte hain? Kripya apna profile chunein."*
- **Conversational Voice Navigation:** Users can tap the mic button and speak in Hindi or English (e.g., *"Kheti ki barish dikhao"* switches the dashboard to Agriculture mode).
- **100% Transparent Cutout:** Zero artificial circle borders; Megha's natural silhouette floats cleanly against any backdrop.

### 3. 🌤️ 24 Dynamic 16:9 Landscape Climate Sky Backgrounds
A curated library of 24 high-resolution widescreen sky images looking directly upwards (zero ground/horizon) that dynamically reflect current atmospheric conditions:
- **Clear & Cloudy:** Clear Day, Clear Night, Mainly Clear, Partly Cloudy, Cloudy, Generally Cloudy, Overcast.
- **Precipitation & Storms:** Drizzle, Moderate Rain, Heavy Rain, Thunderstorm, Squall / Gusty Winds, Cyclonic Storm, Cyclone Eye.
- **Winter & Hazards:** Shallow Fog, Dense Fog, Haze/Smog, Cold Wave (Diamond Dust), Ground Frost, Snowfall, Heavy Snowfall.
- **Heat & Dust:** Heat Wave, Severe Heat Wave, Dust Storm (Andhi).

### 4. 📱 Fully Responsive (Mobile & Desktop)
- **Mobile Layout:** Compact touch-friendly design, bottom navigation, swipeable cards, and full-bleed header banner.
- **Desktop Layout:** Centered multi-column glassmorphic grid, side navigation drawer, and floating conversational companion.

---

## 📂 Repository Structure

```text
mausam_mitra_final/
├── index.html                  # Main responsive web application
├── style.css                   # Glassmorphism design system & responsive layout
├── script.js                   # State manager, real-time weather API, speech synthesis & navigation
├── server.py                   # Lightweight Python development server
├── run_app.bat                 # 1-click Windows launcher
├── assets/
│   ├── avatar/                 # Megha cutouts (idle & speaking transparent PNGs, badges)
│   ├── climates/               # 24 16:9 dynamic sky backgrounds + climate_map.json
│   └── weather_icons/          # 19 transparent condition PNG icons
├── backend/                    # FastAPI server + Gemini AI intent detection & navigation engine
│   ├── main.py
│   ├── config.py
│   ├── ai_module/              # Gemini client, system prompt, intent config, service registry
│   └── weather/                # Open-Meteo client, forecast selector, weather formatter
└── README.md
```

---

## 🚀 Quick Start Guide

### Option 1: Double-Click (Windows 1-Click)
Simply double-click [`run_app.bat`](./run_app.bat). It will start the local server and automatically open your default browser at `http://localhost:8080`.

### Option 2: Python Command Line
```bash
python server.py
```
Then visit `http://localhost:8080` in Chrome, Edge, or Safari.

### Option 3: Direct File Open (Offline Standalone)
Double-click [`index.html`](./index.html) directly in your browser. All UI, client speech synthesis, and persona switching will work out of the box!

---

## 👥 Authors & Team
**Team Vaayu** — Smart India Hackathon (SIH) 2024 / 2025  
*Dedicated to the Ministry of Earth Sciences (MoES) & India Meteorological Department (IMD).*
