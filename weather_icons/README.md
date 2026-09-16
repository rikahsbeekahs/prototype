# 🌤️ Mausam Mitra — Official Weather Condition Icon Pack (Transparent PNGs)

This directory contains the custom-designed, high-fidelity **transparent PNG icon assets** (`RGBA` with alpha channel outside borders) created for **Manjeet (UI/UX Lead)** and the Mausam Mitra mobile application.

All icons have their outer borders/canvases converted to **100% transparent alpha channels**, allowing them to be placed over any app card background, light/dark mode surfaces, or dynamic gradients without ugly box borders.

---

## 📂 Icon Catalog (All 19 Transparent PNGs)

### 1. Standard Clear & Cloudy Conditions
| Condition | Filename | Format | Description |
|---|---|---|---|
| **Clear** | [`clear.png`](./clear.png) | RGBA PNG | 3D radiant golden sun inside circular badge (outer corners transparent) |
| **Mainly Clear** | [`mainly_clear.png`](./mainly_clear.png) | RGBA PNG | Sun with cumulus cloud in rounded glass card (outer background transparent) |
| **Partly Cloudy** | [`partly_cloudy.png`](./partly_cloudy.png) | RGBA PNG | Floating sun behind soft volumetric cloud (isolated transparent) |
| **Generally Cloudy** | [`generally_cloudy.png`](./generally_cloudy.png) | RGBA PNG | Overcast layered clouds inside glass card (outer background transparent) |

### 2. Precipitation (Rain & Storms)
| Condition | Filename | Format | Description |
|---|---|---|---|
| **Drizzle** | [`drizzle.png`](./drizzle.png) | RGBA PNG | Floating light cloud with delicate crystalline raindrops |
| **Moderate Rain** | [`moderate_rain.png`](./moderate_rain.png) | RGBA PNG | Floating raincloud with steady glowing blue rain streaks |
| **Heavy Rain** | [`heavy_rain.png`](./heavy_rain.png) | RGBA PNG | Floating storm cloud with downpour and water splash ripples |
| **Thunderstorm with Rain** | [`thunderstorm.png`](./thunderstorm.png) | RGBA PNG | Dark storm cloud with electric lightning bolt in glass card |
| **Squall / Gusty Winds** | [`squall_winds.png`](./squall_winds.png) | RGBA PNG | High-velocity wind vortex with whipping leaves in glass card |

### 3. Winter & Visibility Hazards
| Condition | Filename | Format | Description |
|---|---|---|---|
| **Shallow Fog** | [`shallow_fog.png`](./shallow_fog.png) | RGBA PNG | Morning low-lying mist in glass card |
| **Dense Fog** | [`dense_fog.png`](./dense_fog.png) | RGBA PNG | Heavy fog sphere with glowing vehicle headlights |
| **Cold Wave** | [`cold_wave.png`](./cold_wave.png) | RGBA PNG | Sub-zero frozen thermometer with sharp icicles & ice shards |
| **Ground Frost** | [`ground_frost.png`](./ground_frost.png) | RGBA PNG | Sparkling crystalline frost on agricultural crop leaves |

### 4. Summer & Heat Hazards
| Condition | Filename | Format | Description |
|---|---|---|---|
| **Heat Wave** | [`heat_wave.png`](./heat_wave.png) | RGBA PNG | Blazing sun with pulsing orange heat waves & thermometer |
| **Severe Heat Wave** | [`severe_heat_wave.png`](./severe_heat_wave.png) | RGBA PNG | Fiery crimson sun, parched cracked soil & emergency alert |
| **Dust Storm (Andhi)** | [`dust_storm.png`](./dust_storm.png) | RGBA PNG | Swirling amber-yellow dust storm & sand dunes |
| **Haze / Smog** | [`haze.png`](./haze.png) | RGBA PNG | Dimmed sun with horizontal particulate aerosol bands |

### 5. Extreme Weather (Severe Alerts)
| Condition | Filename | Format | Description |
|---|---|---|---|
| **Cyclonic Storm** | [`cyclone.png`](./cyclone.png) | RGBA PNG | Swirling oceanic hurricane spiral eye & coastal alert |
| **Heavy Snowfall** | [`heavy_snowfall.png`](./heavy_snowfall.png) | RGBA PNG | Geometric snowflakes over mountain peaks |

---

## 💻 Frontend Developer Usage (React / Vite)

The mapping file [`weather_icon_map.json`](./weather_icon_map.json) maps condition keys and standard WMO weather codes to these transparent `.png` assets:

```javascript
import weatherIcons from './assets/weather_icons/weather_icon_map.json';

export function getWeatherIcon(conditionKey) {
  const item = weatherIcons.conditions[conditionKey];
  return item ? `/assets/weather_icons/${item.file}` : '/assets/weather_icons/clear.png';
}
```
