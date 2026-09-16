# ai_module/service_mapping.py


INTENT_TO_SERVICE = {

    # General
    "current_weather": "weather",
    "weather_forecast": "forecast",
    "rainfall_forecast": "forecast",
    "temperature": "weather",
    "humidity": "weather",
    "wind": "weather",
    "aqi": "aqi",
    "uv_index": "weather",
    "cyclone_alert": "cyclone",
    "severe_weather_alert": "alerts",

    # Agriculture
    "weather_alert": "alerts",
    "agriculture_weather_advice": "agromet",

    # Fitness
    "best_workout_time": "weather",
    "uv_check": "weather",
    "wind_check": "weather",
    "temperature_check": "weather",
    "outdoor_activity": "weather",

    # Health
    "aqi_check": "aqi",
    "humidity_check": "weather",
    "health_weather_advice": "weather",

    # Traveller
    "destination_weather": "weather",
    "travel_weather": "forecast",
    "trip_forecast": "forecast",

    # Family
    "family_weather_safety": "weather",
    "rain_check": "forecast",
    "school_weather": "forecast",
    "weather_alert": "alerts",

    # Commuter
    "commute_weather": "weather",
    "rain_check": "forecast",
    "fog_check": "forecast",
    "visibility_check": "forecast",
    "wind_check": "weather",

    # Beach / Surfer
    "beach_weather": "weather",
    "wave_check": "weather",
    "wind_check": "weather",
    "tide_check": "weather",
    "sea_condition": "weather",

    # Event Planner
    "event_weather": "weather",
    "rain_probability": "forecast",
    "forecast": "forecast",
    "wind_check": "weather",
    "outdoor_event_suitability": "forecast"
}


def get_service_for_intent(intent):

    return INTENT_TO_SERVICE.get(
        intent
    )