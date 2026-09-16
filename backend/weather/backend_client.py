import requests

from config import BACKEND_BASE_URL


def get_weather_from_backend(
    message,
    language,
    persona,
    intent,
    location
):
    url = f"{BACKEND_BASE_URL}/api/query"

    payload = {
        "message": message,
        "language": language,
        "persona": persona,
        "intent": intent,
        "location": location
    }

    response = requests.post(
        url,
        json=payload,
        timeout=60
    )

    response.raise_for_status()

    return response.json()