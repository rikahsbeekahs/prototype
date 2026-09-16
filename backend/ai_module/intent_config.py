# ============================================================
# PERSONA → INTENT MAPPING
# ============================================================

PERSONA_INTENTS = {

    "agriculture": [
        "rainfall_forecast",
        "temperature",
        "weather_alert",
        "humidity",
        "wind",
        "agriculture_weather_advice"
    ],

    "fitness": [
        "best_workout_time",
        "uv_check",
        "wind_check",
        "temperature_check",
        "outdoor_activity"
    ],

    "health": [
        "aqi_check",
        "uv_check",
        "humidity_check",
        "health_weather_advice"
    ],

    "traveller": [
        "destination_weather",
        "travel_weather",
        "trip_forecast"
    ],

    "family": [
        "family_weather_safety",
        "rain_check",
        "school_weather",
        "weather_alert"
    ],

    "commuter": [
        "commute_weather",
        "rain_check",
        "fog_check",
        "visibility_check",
        "wind_check"
    ],

    "beach_surfer": [
        "beach_weather",
        "wave_check",
        "wind_check",
        "tide_check",
        "sea_condition"
    ],

    "event_planner": [
        "event_weather",
        "rain_probability",
        "forecast",
        "wind_check",
        "outdoor_event_suitability"
    ],

    "general": [
        "current_weather",
        "weather_forecast",
        "rainfall_forecast",
        "temperature",
        "humidity",
        "wind",
        "aqi",
        "uv_index",
        "cyclone_alert",
        "severe_weather_alert"
    ]
}


# ============================================================
# INTENT → REQUIRED WEATHER DATA
# ============================================================

INTENT_REQUIREMENTS = {

    # General
    "current_weather": [
        "summary",
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "weather_forecast": [
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "rainfall_forecast": [
        "rain_probability"
    ],

    "temperature": [
        "temperature"
    ],

    "humidity": [
        "humidity"
    ],

    "wind": [
        "wind_speed"
    ],

    "aqi": [
        "aqi"
    ],

    "uv_index": [
        "uv_index"
    ],

    "cyclone_alert": [
        "weather_alert"
    ],

    "severe_weather_alert": [
        "weather_alert"
    ],


    # Agriculture
    "weather_alert": [
        "weather_alert"
    ],

    "agriculture_weather_advice": [
        "temperature",
        "humidity",
        "wind_speed",
        "rain_probability"
    ],


    # Fitness
    "best_workout_time": [
        "temperature",
        "rain_probability",
        "wind_speed"
    ],

    "uv_check": [
        "uv_index"
    ],

    "wind_check": [
        "wind_speed"
    ],

    "temperature_check": [
        "temperature"
    ],

    "outdoor_activity": [
        "temperature",
        "rain_probability",
        "wind_speed"
    ],


    # Health
    "aqi_check": [
        "aqi"
    ],

    "humidity_check": [
        "humidity"
    ],

    "health_weather_advice": [
        "temperature",
        "humidity",
        "aqi",
        "uv_index"
    ],


    # Traveller
    "destination_weather": [
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "travel_weather": [
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "trip_forecast": [
        "temperature",
        "humidity",
        "wind_speed"
    ],


    # Family
    "family_weather_safety": [
        "temperature",
        "rain_probability"
    ],

    "rain_check": [
        "rain_probability"
    ],

    "school_weather": [
        "temperature",
        "rain_probability",
        "weather_alert"
    ],


    # Commuter
    "commute_weather": [
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "fog_check": [
        "fog"
    ],

    "visibility_check": [
        "visibility"
    ],


    # Beach / Surfer
    "beach_weather": [
        "temperature",
        "wind_speed"
    ],

    "wave_check": [
        "wave_height"
    ],

    "tide_check": [
        "tide"
    ],

    "sea_condition": [
        "sea_condition"
    ],


    # Event Planner
    "event_weather": [
        "temperature",
        "wind_speed"
    ],

    "rain_probability": [
        "rain_probability"
    ],

    "forecast": [
        "temperature",
        "humidity",
        "wind_speed"
    ],

    "outdoor_event_suitability": [
        "temperature",
        "wind_speed",
        "rain_probability"
    ]
}


# ============================================================
# CURRENT BACKEND CAPABILITIES
# ============================================================

# Based on the backend response currently confirmed.

WEATHER_DATA_CAPABILITIES = {
    "summary": True,
    "temperature": True,
    "humidity": True,
    "wind_speed": True,
    "rain_probability": True,
    "precipitation": True,
    "rain": True,
    "apparent_temperature": True,
    "uv_index": True,
    "sunrise": True,
    "sunset": True,
    "weather_condition": True,

    # Not currently provided by our Open-Meteo configuration
    "aqi": False,
    "weather_alert": False,
    "fog": False,
    "visibility": False,
    "wave_height": False,
    "tide": False,
    "sea_condition": False
}

# ============================================================
# HELPER FUNCTIONS
# ============================================================

def is_intent_allowed_for_persona(persona, intent):
    """
    Check whether an intent belongs to the given persona.
    """

    allowed_intents = PERSONA_INTENTS.get(
        persona,
        []
    )

    return intent in allowed_intents


def get_required_fields(intent):
    """
    Return weather fields required by an intent.
    """

    return INTENT_REQUIREMENTS.get(
        intent,
        []
    )


def get_missing_backend_fields(intent):
    required_fields = get_required_fields(intent)

    missing_fields = []

    for field in required_fields:

        if not WEATHER_DATA_CAPABILITIES.get(
            field,
            False
        ):
            missing_fields.append(field)

    return missing_fields