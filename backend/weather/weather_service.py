from weather.open_meteo_client import get_weather
from weather.weather_formatter import normalize_weather_data


def get_normalized_weather(
    latitude,
    longitude,
    location=None
):
    """
    Fetch weather data from Open-Meteo
    and convert it into Mausam Mitra's
    normalized weather structure.
    """

    raw_weather = get_weather(
        latitude=latitude,
        longitude=longitude
    )

    normalized_weather = normalize_weather_data(
        raw_weather,
        location=location
    )

    return normalized_weather