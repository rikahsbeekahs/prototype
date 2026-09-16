import json

from weather.open_meteo_client import get_weather


latitude = 25.5941
longitude = 85.1376


try:
    result = get_weather(
        latitude=latitude,
        longitude=longitude
    )

    print("\n" + "=" * 70)
    print("OPEN-METEO WEATHER TEST")
    print("=" * 70)

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )

    print("\n" + "=" * 70)
    print("SUCCESS: Open-Meteo API is working.")
    print("=" * 70)

except Exception as error:

    print("\n" + "=" * 70)
    print("OPEN-METEO ERROR")
    print("=" * 70)

    print(error)