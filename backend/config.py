import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
BACKEND_BASE_URL = os.getenv("BACKEND_BASE_URL")
OPEN_METEO_BASE_URL = os.getenv(
    "OPEN_METEO_BASE_URL",
    "https://api.open-meteo.com/v1"
)

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY not found. Check your .env file."
    )

if not BACKEND_BASE_URL:
    raise ValueError(
        "BACKEND_BASE_URL not found. Check your .env file."
    )