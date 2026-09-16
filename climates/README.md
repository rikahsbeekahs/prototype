# 🌦️ Mausam Mitra — Climate Header Backgrounds (Sky Only, 16:9 Landscape)

This directory contains high-resolution (1376x768, 16:9 widescreen landscape) `.jpg` background sky images created for **Manjeet (UI/UX Lead)** to power the dynamic top climate banner in the Mausam Mitra web application and mobile UI.

## 🎯 Design Specifications:
1. **Sky Only (No Ground):** Looking directly up into the sky. Zero ground, zero buildings, zero trees, zero horizon.
2. **Active Atmospheric Motion:** Realistic clouds, precipitation, blizzard flurries, lightning, diamond dust, or solar mirages.
3. **Optimized for UI Text Readability:** Balanced contrast allowing weather typography (`28°C`, `New Delhi`, `Feels like 32°C`, AQI tags) to stand out cleanly.
4. **Format:** High quality `.jpg` (16:9 widescreen landscape).

---

## 📂 Complete Climate Background Catalog (24 Images)

### ☀️ Clear & Cloudy Conditions
| Climate State | Filename | Description |
|---|---|---|
| ☀️ **Clear Day** | [`clear_day.jpg`](./clear_day.jpg) | Azure blue sky with brilliant sun and solar lens flare |
| 🌙 **Clear Night** | [`clear_night.jpg`](./clear_night.jpg) | Midnight starry sky with celestial stars & crescent moon |
| 🌤️ **Mainly Clear** | [`mainly_clear.jpg`](./mainly_clear.jpg) | Mostly sunny with delicate, thin wispy cirrus clouds |
| ⛅ **Partly Cloudy** | [`partly_cloudy.jpg`](./partly_cloudy.jpg) | Volumetric cumulus clouds with sunbeams breaking through |
| ☁️ **Cloudy** | [`cloudy.jpg`](./cloudy.jpg) | Rich layers of textured cumulus and altocumulus clouds |
| 🌫️ **Generally Cloudy** | [`generally_cloudy.jpg`](./generally_cloudy.jpg) | Seamless overcast layer of stratocumulus with soft diffuse light |
| ☁️ **Overcast** | [`overcast.jpg`](./overcast.jpg) | Dense textured silver/charcoal overcast cloud cover |

### 🌧️ Precipitation & Severe Storms
| Climate State | Filename | Description |
|---|---|---|
| 🌦️ **Drizzle** | [`drizzle.jpg`](./drizzle.jpg) | Fine misty light rain streaks falling softly through overcast sky |
| 🌧️ **Moderate Rain** | [`moderate_rain.jpg`](./moderate_rain.jpg) | Steady vertical rain streaks falling from soft grey-blue clouds |
| ⛈️ **Heavy Rain** | [`heavy_rain.jpg`](./heavy_rain.jpg) | Dramatic torrential rain pouring down from dark stormy clouds |
| ⚡ **Thunderstorm** | [`thunderstorm.jpg`](./thunderstorm.jpg) | Dark violet-indigo clouds illuminated by electric lightning fork |
| 💨 **Squall / Gusty Winds** | [`squall_winds.jpg`](./squall_winds.jpg) | Ragged dark scud clouds whipped by high-speed wind shear |
| 🌀 **Cyclonic Storm** | [`cyclonic_storm.jpg`](./cyclonic_storm.jpg) | Violent outer hurricane rainbands spiraling with torrential squall |
| 🌀 **Cyclone Eye** | [`cyclone.jpg`](./cyclone.jpg) | Monstrous circular hurricane spiral eye looking straight up |

### ❄️ Winter & Visibility Conditions
| Climate State | Filename | Description |
|---|---|---|
| 🌫️ **Fog / Shallow Fog** | [`fog.jpg`](./fog.jpg) | Dense misty atmosphere with pale diffuse sun glowing through |
| 🌁 **Dense Fog** | [`dense_fog.jpg`](./dense_fog.jpg) | Opaque blanket of thick fog with near-zero visibility |
| 🏭 **Haze / Smog** | [`haze.jpg`](./haze.jpg) | Warm brownish-yellow particulate smog and haze |
| 🥶 **Cold Wave** | [`cold_wave.jpg`](./cold_wave.jpg) | Freezing subzero steel-blue sky with shimmering diamond dust crystals |
| ❄️ **Ground Frost** | [`ground_frost.jpg`](./ground_frost.jpg) | Crisp subzero early morning sky with delicate crystalline frost patterns |
| 🌨️ **Snow / Snowfall** | [`snow.jpg`](./snow.jpg) | Soft crystalline white snowflakes gently falling through cold clouds |
| ❄️ **Heavy Snowfall** | [`heavy_snowfall.jpg`](./heavy_snowfall.jpg) | Heavy blizzard whiteout with dense clusters of large snow flakes |

### 🔥 Heat & Extreme Atmospheric
| Climate State | Filename | Description |
|---|---|---|
| 🔥 **Heat Wave** | [`heat_wave.jpg`](./heat_wave.jpg) | Scorching sun with intense heat shimmer distortion ripples |
| 🚨 **Severe Heat Wave** | [`severe_heat_wave.jpg`](./severe_heat_wave.jpg) | Blistering white-hot sun in deep fiery red-orange thermal atmosphere |
| 🌪️ **Dust Storm (Andhi)** | [`dust_storm.jpg`](./dust_storm.jpg) | Swirling amber-yellow sandstorm clouds obscuring the sun |

---

## 💻 Frontend Implementation (HTML / CSS / React)

### In CSS:
```css
.weather-header-banner {
  width: 100%;
  height: 340px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transition: background-image 0.5s ease-in-out;
  border-radius: 0 0 24px 24px;
}
```

### Dynamic Climate Switcher (JavaScript / React):
```javascript
import climateMap from './assets/climates/climate_map.json';

// Get background image URL based on weather condition key:
function getClimateBackground(conditionKey) {
  const item = climateMap.climates[conditionKey];
  return item ? `/assets/climates/${item.file}` : '/assets/climates/clear_day.jpg';
}

// Example usage:
const bannerStyle = {
  backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.4)), url(${getClimateBackground('severe_heat_wave')})`
};
```
