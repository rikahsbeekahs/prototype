from pydantic import BaseModel, Field
from typing import Optional


# ============================================================
# SUPPORTED PERSONAS
# ============================================================

SUPPORTED_PERSONAS = [
    "health",
    "fitness",
    "beach_surfer",
    "traveller",
    "family",
    "agriculture",
    "commuter",
    "event_planner",
    "general"
]


# ============================================================
# SUPPORTED INTENTS
# ============================================================

SUPPORTED_INTENTS = [

    # --------------------------------------------------------
    # GENERAL WEATHER
    # --------------------------------------------------------

    "current_weather",
    "weather_forecast",
    "rainfall_forecast",
    "temperature",
    "humidity",
    "wind",
    "aqi",
    "uv_index",
    "cyclone_alert",
    "cyclone_information",
    "severe_weather_alert",
    "radar",
    "map",

    # --------------------------------------------------------
    # AGRICULTURE
    # --------------------------------------------------------

    "weather_alert",
    "agriculture_weather_advice",

    # --------------------------------------------------------
    # FITNESS
    # --------------------------------------------------------

    "best_workout_time",
    "uv_check",
    "wind_check",
    "temperature_check",
    "outdoor_activity",

    # --------------------------------------------------------
    # HEALTH
    # --------------------------------------------------------

    "aqi_check",
    "humidity_check",
    "health_weather_advice",

    # --------------------------------------------------------
    # TRAVELLER
    # --------------------------------------------------------

    "destination_weather",
    "travel_weather",
    "trip_forecast",

    # --------------------------------------------------------
    # FAMILY
    # --------------------------------------------------------

    "family_weather_safety",
    "rain_check",
    "school_weather",

    # --------------------------------------------------------
    # COMMUTER
    # --------------------------------------------------------

    "commute_weather",
    "fog_check",
    "visibility_check",

    # --------------------------------------------------------
    # BEACH / SURFER
    # --------------------------------------------------------

    "beach_weather",
    "wave_check",
    "tide_check",
    "sea_condition",

    # --------------------------------------------------------
    # EVENT PLANNER
    # --------------------------------------------------------

    "event_weather",
    "rain_probability",
    "forecast",
    "outdoor_event_suitability",

    # --------------------------------------------------------
    # FALLBACK
    # --------------------------------------------------------

    "unknown"
]


# ============================================================
# SUPPORTED SERVICES
# ============================================================

SUPPORTED_SERVICES = [

    "weather",
    "forecast",
    "aqi",
    "alerts",
    "radar",
    "cyclone",
    "agromet",
    "map"
]


# ============================================================
# SUPPORTED ACTIONS
# ============================================================

SUPPORTED_ACTIONS = [

    "navigate",
    "answer",
    "navigate_or_answer",
    "unknown"
]


# ============================================================
# AI UNDERSTANDING OUTPUT
# ============================================================

class AIUnderstandingOutput(BaseModel):

    # --------------------------------------------------------
    # LANGUAGE
    # --------------------------------------------------------

    language: str = Field(
        description=(
            "Detected language. "
            "Allowed values: Hindi, English, Hinglish, Other."
        )
    )

    # --------------------------------------------------------
    # PERSONA
    # --------------------------------------------------------

    persona: Optional[str] = Field(
        default=None,
        description=(
            "Detected user persona such as "
            "health, fitness, traveller, family, "
            "agriculture, commuter, beach_surfer, "
            "event_planner, or general."
        )
    )

    # --------------------------------------------------------
    # INTENT
    # --------------------------------------------------------

    intent: Optional[str] = Field(
        default=None,
        description=(
            "Detected weather-related user intent."
        )
    )

    # --------------------------------------------------------
    # SERVICE
    # --------------------------------------------------------

    service: Optional[str] = Field(
        default=None,
        description=(
            "Mausam Mitra service required to satisfy "
            "the user's request. "
            "Examples: weather, forecast, aqi, alerts, "
            "radar, cyclone, agromet, or map."
        )
    )

    # --------------------------------------------------------
    # ACTION
    # --------------------------------------------------------

    action: Optional[str] = Field(
        default=None,
        description=(
            "Action required for the request. "
            "Allowed values: navigate, answer, "
            "navigate_or_answer, or unknown."
        )
    )

    # --------------------------------------------------------
    # LOCATION
    # --------------------------------------------------------

    location: Optional[str] = Field(
        default=None,
        description=(
            "Location mentioned by the user. "
            "Use 'current' when the user refers to "
            "their current location."
        )
    )

    # --------------------------------------------------------
    # DATE
    # --------------------------------------------------------

    date: Optional[str] = Field(
        default=None,
        description=(
            "Requested date or relative date such as "
            "today, tomorrow, or a specific date."
        )
    )