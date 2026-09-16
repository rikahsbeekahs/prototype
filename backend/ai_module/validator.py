from ai_module.schema import (
    SUPPORTED_PERSONAS,
    SUPPORTED_INTENTS
)

from ai_module.intent_config import (
    is_intent_allowed_for_persona
)

from ai_module.service_registry import (
    is_valid_service,
    is_valid_action
)

from ai_module.service_mapping import (
    get_service_for_intent
)


def validate_output(data):

    result = {
        "language": data.get(
            "language",
            "Other"
        ),

        "persona": data.get(
            "persona",
            "general"
        ),

        "intent": data.get(
            "intent",
            "unknown"
        ),

        "service": data.get(
            "service"
        ),

        "action": data.get(
            "action"
        ),

        "location": data.get(
            "location"
        ),

        "date": data.get(
            "date"
        )
    }


    # ========================================================
    # LANGUAGE
    # ========================================================

    valid_languages = [
        "Hindi",
        "English",
        "Hinglish",
        "Other"
    ]

    if result["language"] not in valid_languages:

        result["language"] = "Other"


    # ========================================================
    # PERSONA
    # ========================================================

    if result["persona"] not in SUPPORTED_PERSONAS:

        result["persona"] = "general"


    # ========================================================
    # INTENT
    # ========================================================

    if result["intent"] not in SUPPORTED_INTENTS:

        result["intent"] = "unknown"


    # ========================================================
    # PERSONA + INTENT COMPATIBILITY
    # ========================================================

    if result["intent"] != "unknown":

        allowed = is_intent_allowed_for_persona(
            result["persona"],
            result["intent"]
        )

        if not allowed:

            result["intent"] = "unknown"


    # ========================================================
    # SERVICE VALIDATION
    # ========================================================

    if not is_valid_service(
        result["service"]
    ):

        # Try to automatically derive the service
        # from the detected intent.

        mapped_service = get_service_for_intent(
            result["intent"]
        )

        if mapped_service:

            result["service"] = mapped_service

        else:

            result["service"] = None


    # ========================================================
    # ACTION VALIDATION
    # ========================================================

    if not is_valid_action(
        result["action"]
    ):

        result["action"] = "unknown"


    # ========================================================
    # MISSING FIELDS
    # ========================================================

    missing_fields = []


    # "current" is a valid location.
    if not result["location"]:

        missing_fields.append(
            "location"
        )


    # Intent must be known.
    if result["intent"] == "unknown":

        missing_fields.append(
            "intent"
        )


    # Service must be known.
    if not result["service"]:

        missing_fields.append(
            "service"
        )


    # Action must be known.
    if result["action"] == "unknown":

        missing_fields.append(
            "action"
        )


    # ========================================================
    # FINAL VALIDATION STATUS
    # ========================================================

    result["missing_fields"] = missing_fields

    result["needs_clarification"] = (
        len(missing_fields) > 0
    )


    return result