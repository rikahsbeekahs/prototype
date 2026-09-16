import json

from weather.weather_service import (
    get_normalized_weather
)


latitude = 25.5941
longitude = 85.1376


try:

    weather_data = get_normalized_weather(
        latitude=latitude,
        longitude=longitude,
        location="Patna"
    )

    print("\n" + "=" * 70)
    print("MAUSAM MITRA WEATHER SERVICE TEST")
    print("=" * 70)

    print(
        json.dumps(
            weather_data,
            indent=4,
            ensure_ascii=False
        )
    )

    print("\n" + "=" * 70)
    print("SUCCESS: Weather service is working.")
    print("=" * 70)


except Exception as error:

    print("\n" + "=" * 70)
    print("WEATHER SERVICE ERROR")
    print("=" * 70)

    print(error)