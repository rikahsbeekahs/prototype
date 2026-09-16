import json

from google import genai

from config import GEMINI_API_KEY
from ai_module.prompt import SYSTEM_PROMPT


client = genai.Client(
    api_key=GEMINI_API_KEY
)


def get_ai_response(
    question,
    user_location=None
):

    location_context = user_location or "unknown"

    prompt = f"""
{SYSTEM_PROMPT}

USER QUESTION:
{question}

USER LOCATION:
{location_context}

Return ONLY valid JSON.
"""

    # --------------------------------------------------------
    # Use Chat instead of direct Models.generate_content
    # --------------------------------------------------------

    chat = client.chats.create(
        model="gemini-3.6-flash"
    )

    response = chat.send_message(
        prompt
    )

    return response.text.strip()