WEATHER_CODE_MAP = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Fog",
    48: "Depositing rime fog",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",

    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",

    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",

    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",

    85: "Slight snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
}


def get_weather_description(weather_code):
    return WEATHER_CODE_MAP.get(
        weather_code,
        "Unknown weather condition"
    )


def get_current_weather_data(weather_data):

    current = weather_data.get(
        "current",
        {}
    )

    return {
        "time": current.get("time"),
        "temperature": current.get(
            "temperature_2m"
        ),
        "humidity": current.get(
            "relative_humidity_2m"
        ),
        "apparent_temperature": current.get(
            "apparent_temperature"
        ),
        "precipitation": current.get(
            "precipitation"
        ),
        "weather_code": current.get(
            "weather_code"
        ),
        "weather_condition": get_weather_description(
            current.get("weather_code")
        ),
        "wind_speed": current.get(
            "wind_speed_10m"
        ),
        "wind_direction": current.get(
            "wind_direction_10m"
        )
    }


def get_daily_forecast(
    weather_data,
    day_index
):

    daily = weather_data.get(
        "daily",
        {}
    )

    times = daily.get("time", [])

    if day_index >= len(times):
        return None

    weather_code = daily.get(
        "weather_code",
        []
    )[day_index]

    return {
        "date": times[day_index],

        "weather_code": weather_code,

        "weather_condition": get_weather_description(
            weather_code
        ),

        "temperature_max": daily.get(
            "temperature_2m_max",
            []
        )[day_index],

        "temperature_min": daily.get(
            "temperature_2m_min",
            []
        )[day_index],

        "apparent_temperature_max": daily.get(
            "apparent_temperature_max",
            []
        )[day_index],

        "apparent_temperature_min": daily.get(
            "apparent_temperature_min",
            []
        )[day_index],

        "precipitation": daily.get(
            "precipitation_sum",
            []
        )[day_index],

        "rain": daily.get(
            "rain_sum",
            []
        )[day_index],

        "rain_probability": daily.get(
            "precipitation_probability_max",
            []
        )[day_index],

        "wind_speed_max": daily.get(
            "wind_speed_10m_max",
            []
        )[day_index],

        "uv_index_max": daily.get(
            "uv_index_max",
            []
        )[day_index],

        "sunrise": daily.get(
            "sunrise",
            []
        )[day_index],

        "sunset": daily.get(
            "sunset",
            []
        )[day_index]
    }


def get_seven_day_forecast(weather_data):

    forecast = []

    daily = weather_data.get(
        "daily",
        {}
    )

    dates = daily.get(
        "time",
        []
    )

    for index in range(len(dates)):

        day = get_daily_forecast(
            weather_data,
            index
        )

        if day:
            forecast.append(day)

    return forecast


def normalize_weather_data(
    weather_data,
    location=None
):

    current = get_current_weather_data(
        weather_data
    )

    forecast = get_seven_day_forecast(
        weather_data
    )

    return {
        "location": location,

        "coordinates": {
            "latitude": weather_data.get(
                "latitude"
            ),
            "longitude": weather_data.get(
                "longitude"
            )
        },

        "timezone": weather_data.get(
            "timezone"
        ),

        "current": current,

        "forecast": forecast
    }