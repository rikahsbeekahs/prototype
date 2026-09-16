import json

from ai_module.gemini_client import (
    get_ai_response
)

from ai_module.parser import (
    parse_ai_response
)

from ai_module.validator import (
    validate_output
)

from ai_module.capability import (
    check_intent_capability
)

from ai_module.navigation import (
    decide_navigation
)

from weather.weather_service import (
    get_normalized_weather
)

from ai_module.response_generator import (
    generate_final_response,
    select_relevant_weather_data
)


# ============================================================
# AI UNDERSTANDING
# ============================================================

def understand_question(
    question,
    user_location=None
):
    """
    Send the user's question to Gemini
    and convert the response into validated
    Mausam Mitra AI understanding.
    """

    raw_response = get_ai_response(
        question,
        user_location
    )

    parsed_response = parse_ai_response(
        raw_response
    )

    validated_response = validate_output(
        parsed_response
    )

    return validated_response


# ============================================================
# MAIN WEATHER QUESTION PROCESSING
# ============================================================

def process_weather_question(
    question,
    user_location
):

    # --------------------------------------------------------
    # STEP 1: Gemini Understanding
    # --------------------------------------------------------

    understanding = understand_question(
        question,
        user_location=user_location.get("city")
    )


    # --------------------------------------------------------
    # STEP 2: Default Location
    # --------------------------------------------------------

    if not understanding.get("location"):
        understanding["location"] = "current"


    # --------------------------------------------------------
    # STEP 3: Check Missing Information
    # --------------------------------------------------------

    missing_fields = []

    intent = understanding.get("intent")

    if (
        not intent
        or intent == "unknown"
    ):
        missing_fields.append("intent")


    understanding["missing_fields"] = (
        missing_fields
    )

    understanding["needs_clarification"] = (
        len(missing_fields) > 0
    )


    # --------------------------------------------------------
    # DISPLAY AI UNDERSTANDING
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("AI UNDERSTANDING")
    print("=" * 70)

    print(
        json.dumps(
            understanding,
            indent=4,
            ensure_ascii=False
        )
    )


    # --------------------------------------------------------
    # STEP 4: Clarification
    # --------------------------------------------------------

    if understanding.get(
        "needs_clarification"
    ):

        return {
            "type": "clarification",

            "understanding": understanding,

            "message": (
                "Please provide the missing information: "
                + ", ".join(
                    understanding.get(
                        "missing_fields",
                        []
                    )
                )
            )
        }


    # --------------------------------------------------------
    # STEP 5: Capability Check
    # --------------------------------------------------------

    capability = check_intent_capability(
        intent
    )


    print("\n" + "=" * 70)
    print("CAPABILITY CHECK")
    print("=" * 70)

    print(
        json.dumps(
            capability,
            indent=4,
            ensure_ascii=False
        )
    )


    # --------------------------------------------------------
    # STEP 6: Navigation Decision
    # --------------------------------------------------------

    navigation = decide_navigation(
        understanding
    )


    print("\n" + "=" * 70)
    print("NAVIGATION DECISION")
    print("=" * 70)

    print(
        json.dumps(
            navigation,
            indent=4,
            ensure_ascii=False
        )
    )


    # --------------------------------------------------------
    # STEP 7: Navigation Request
    # --------------------------------------------------------

    if navigation["decision"] == "navigate":

        return {
            "type": "navigation",

            "understanding": understanding,

            "capability": capability,

            "navigation": navigation,

            "message": (
                "Navigate to "
                + str(
                    navigation.get(
                        "service"
                    )
                )
                + " service."
            )
        }


    # --------------------------------------------------------
    # STEP 8: Check Weather Data Capability
    # --------------------------------------------------------

    if not capability["supported"]:

        missing = ", ".join(
            capability["missing_fields"]
        )

        return {
            "type": "unsupported_intent",

            "understanding": understanding,

            "capability": capability,

            "navigation": navigation,

            "message": (
                "Sorry, information about "
                + missing
                + " is currently not available."
            )
        }


    # --------------------------------------------------------
    # STEP 9: Get Weather from Open-Meteo
    # --------------------------------------------------------

    try:

        weather_data = get_normalized_weather(
            latitude=user_location["latitude"],
            longitude=user_location["longitude"],
            location=user_location.get("city")
        )

    except Exception as error:

        return {
            "type": "weather_error",

            "understanding": understanding,

            "capability": capability,

            "navigation": navigation,

            "error": str(error),

            "message": (
                "Sorry, I could not fetch the latest "
                "weather information right now."
            )
        }


    # --------------------------------------------------------
    # STEP 10: Select Relevant Weather Data
    #
    # Example:
    #
    # User: "Kal baarish hogi?"
    #
    # Instead of sending all 7 days to Gemini,
    # only tomorrow's relevant forecast is selected.
    # --------------------------------------------------------

    try:

        relevant_weather_data = (
            select_relevant_weather_data(
                understanding,
                weather_data
            )
        )

    except Exception as error:

        return {
            "type": "weather_selection_error",

            "understanding": understanding,

            "capability": capability,

            "navigation": navigation,

            "weather_data": weather_data,

            "error": str(error),

            "message": (
                "Weather data was received successfully, "
                "but I could not select the relevant "
                "weather information."
            )
        }


    # --------------------------------------------------------
    # STEP 11: Generate Final AI Response
    # --------------------------------------------------------

    try:

        final_answer = generate_final_response(
            understanding,
            relevant_weather_data
        )

    except Exception as error:

        return {
            "type": "response_generation_error",

            "understanding": understanding,

            "capability": capability,

            "navigation": navigation,

            "weather_data": weather_data,

            "relevant_weather_data": (
                relevant_weather_data
            ),

            "error": str(error),

            "message": (
                "Weather data was received successfully, "
                "but I could not generate the final response."
            )
        }


    # --------------------------------------------------------
    # STEP 12: Return Complete Result
    # --------------------------------------------------------

    return {

        "type": "weather_response",

        "understanding": understanding,

        "capability": capability,

        "navigation": navigation,

        # Complete API response
        "weather_data": weather_data,

        # Only data relevant to the user's question
        "relevant_weather_data": (
            relevant_weather_data
        ),

        # Final human-friendly response
        "final_answer": final_answer
    }


# ============================================================
# APPLICATION ENTRY POINT
# ============================================================

if __name__ == "__main__":

    # --------------------------------------------------------
    # Get User Question
    # --------------------------------------------------------

    question = input(
        "\nAsk Mausam Mitra: "
    )


    # --------------------------------------------------------
    # Current User Location
    #
    # For prototype/testing we are using fixed coordinates.
    # Later these coordinates will come from the mobile app.
    # --------------------------------------------------------

    user_location = {

        "type": "current_location",

        "latitude": 25.5941,

        "longitude": 85.1376,

        "city": "Patna"
    }


    # --------------------------------------------------------
    # Process Question
    # --------------------------------------------------------

    try:

        result = process_weather_question(
            question,
            user_location
        )

    except Exception as error:

        print("\n" + "=" * 70)
        print("APPLICATION ERROR")
        print("=" * 70)

        print(error)

        raise


    # --------------------------------------------------------
    # DISPLAY RESULT
    # --------------------------------------------------------

    print("\n" + "=" * 70)


    # ========================================================
    # CLARIFICATION
    # ========================================================

    if result["type"] == "clarification":

        print(
            "\nCLARIFICATION NEEDED:\n"
        )

        print(
            result["message"]
        )


    # ========================================================
    # NAVIGATION
    # ========================================================

    elif result["type"] == "navigation":

        print(
            "\nNAVIGATION REQUIRED:\n"
        )

        print(
            "Intent: "
            + str(
                result["understanding"].get(
                    "intent"
                )
            )
        )

        print(
            "Service: "
            + str(
                result["navigation"].get(
                    "service"
                )
            )
        )

        print(
            "Action: "
            + str(
                result["understanding"].get(
                    "action"
                )
            )
        )

        print(
            "Decision: "
            + str(
                result["navigation"].get(
                    "decision"
                )
            )
        )

        print(
            "Route: "
            + str(
                result["navigation"].get(
                    "route"
                )
            )
        )

        print(
            "\nMessage:"
        )

        print(
            result["message"]
        )


    # ========================================================
    # UNSUPPORTED INTENT
    # ========================================================

    elif result["type"] == "unsupported_intent":

        print(
            "\nINFORMATION NOT AVAILABLE:\n"
        )

        print(
            result["message"]
        )


    # ========================================================
    # WEATHER RESPONSE
    # ========================================================

    elif result["type"] == "weather_response":

        print(
            "\nRELEVANT WEATHER DATA:\n"
        )

        print(
            json.dumps(
                result.get(
                    "relevant_weather_data",
                    {}
                ),
                indent=4,
                ensure_ascii=False
            )
        )

        print(
            "\n" + "=" * 70
        )

        print(
            "\nMAUSAM MITRA:\n"
        )

        print(
            result["final_answer"]
        )


    # ========================================================
    # WEATHER API ERROR
    # ========================================================

    elif result["type"] == "weather_error":

        print(
            "\nWEATHER API ERROR:\n"
        )

        print(
            result["message"]
        )

        print(
            "\nTechnical Error:"
        )

        print(
            result["error"]
        )


    # ========================================================
    # WEATHER DATA SELECTION ERROR
    # ========================================================

    elif result["type"] == "weather_selection_error":

        print(
            "\nWEATHER DATA SELECTION ERROR:\n"
        )

        print(
            result["message"]
        )

        print(
            "\nTechnical Error:"
        )

        print(
            result["error"]
        )


    # ========================================================
    # GEMINI RESPONSE ERROR
    # ========================================================

    elif result["type"] == "response_generation_error":

        print(
            "\nRESPONSE GENERATION ERROR:\n"
        )

        print(
            result["message"]
        )

        print(
            "\nTechnical Error:"
        )

        print(
            result["error"]
        )


    # ========================================================
    # UNKNOWN RESULT
    # ========================================================

    else:

        print(
            "\nUNKNOWN RESULT TYPE:\n"
        )

        print(
            json.dumps(
                result,
                indent=4,
                ensure_ascii=False
            )
        )


    print(
        "\n" + "=" * 70
    )