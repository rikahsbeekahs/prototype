import json

from google import genai

from config import GEMINI_API_KEY
from ai_module.prompt import RESPONSE_PROMPT

from weather.forecast_selector import (
    select_forecast
)


client = genai.Client(
    api_key=GEMINI_API_KEY
)


# ============================================================
# SELECT RELEVANT WEATHER DATA
# ============================================================

def select_relevant_weather_data(
    understanding_data,
    weather_data
):
    """
    Select only the weather information relevant
    to the user's intent and requested date.

    This prevents unnecessary weather data from
    being sent to Gemini.
    """

    intent = understanding_data.get(
        "intent",
        "current_weather"
    )

    current = weather_data.get(
        "current",
        {}
    )

    result = {
        "location": weather_data.get(
            "location"
        ),
        "timezone": weather_data.get(
            "timezone"
        )
    }


    # --------------------------------------------------------
    # CURRENT WEATHER / CURRENT CONDITIONS
    # --------------------------------------------------------

    current_intents = [

        "current_weather",

        "temperature",

        "humidity",

        "wind",

        "temperature_check",

        "humidity_check",

        "wind_check",

        "aqi_check",

        "uv_check",

        "health_weather_advice",

        "outdoor_activity",

        "fitness_weather",

        "health_weather",

        "agriculture_weather",

        "travel_weather",

        "commute_weather",

        "event_weather",

        "beach_weather"
    ]


    if intent in current_intents:

        result["current"] = current


    # --------------------------------------------------------
    # FORECAST / FUTURE WEATHER
    # --------------------------------------------------------

    forecast_intents = [

        "weather_forecast",

        "rainfall_forecast",

        "rain_check",

        "forecast",

        "trip_forecast",

        "destination_weather",

        "family_weather_safety",

        "school_weather",

        "commute_weather",

        "fog_check",

        "visibility_check",

        "event_weather",

        "rain_probability",

        "outdoor_event_suitability",

        "best_workout_time",

        "agriculture_weather_advice",

        "weather_alert",

        "weather_alerts"
    ]


    if intent in forecast_intents:

        selected_forecast = select_forecast(
            understanding_data,
            weather_data
        )

        result["forecast"] = selected_forecast


    # --------------------------------------------------------
    # UNKNOWN INTENT
    #
    # Give Gemini both current and relevant forecast
    # so it has enough context to understand the request.
    # --------------------------------------------------------

    if intent == "unknown":

        result["current"] = current

        result["forecast"] = select_forecast(
            understanding_data,
            weather_data
        )


    # --------------------------------------------------------
    # FALLBACK
    #
    # If a valid intent wasn't matched above, provide
    # current weather rather than sending the entire API data.
    # --------------------------------------------------------

    if (
        "current" not in result
        and "forecast" not in result
    ):

        result["current"] = current


    return result


# ============================================================
# GENERATE FINAL AI RESPONSE
# ============================================================

def generate_final_response(
    understanding_data,
    weather_data
):

    language = understanding_data.get(
        "language",
        "English"
    )

    persona = understanding_data.get(
        "persona",
        "general"
    )

    intent = understanding_data.get(
        "intent",
        "current_weather"
    )

    date = understanding_data.get(
        "date"
    )

    weather_json = json.dumps(
        weather_data,
        ensure_ascii=False,
        indent=2
    )

    prompt = f"""
{RESPONSE_PROMPT}

USER CONTEXT:

Language:
{language}

Persona:
{persona}

Intent:
{intent}

Requested Date:
{date}


WEATHER INFORMATION:

{weather_json}


Generate the final TTS-friendly response.
"""


    # --------------------------------------------------------
    # Use Chat.send_message
    # --------------------------------------------------------

    chat = client.chats.create(
        model="gemini-3.6-flash"
    )

    response = chat.send_message(
        prompt
    )

    return response.text.strip()