import json

from weather.open_meteo_client import (
    get_weather
)

from weather.weather_formatter import (
    normalize_weather_data
)


latitude = 25.5941
longitude = 85.1376


try:

    raw_weather = get_weather(
        latitude=latitude,
        longitude=longitude
    )

    normalized_weather = normalize_weather_data(
        raw_weather,
        location="Patna"
    )

    print("\n" + "=" * 70)
    print("NORMALIZED MAUSAM MITRA WEATHER DATA")
    print("=" * 70)

    print(
        json.dumps(
            normalized_weather,
            indent=4,
            ensure_ascii=False
        )
    )

    print("\n" + "=" * 70)
    print("SUCCESS: Weather data normalized.")
    print("=" * 70)

except Exception as error:

    print("\n" + "=" * 70)
    print("FORMATTER ERROR")
    print("=" * 70)

    print(error)