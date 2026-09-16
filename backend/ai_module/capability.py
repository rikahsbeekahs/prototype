from ai_module.intent_config import (
    get_required_fields,
    get_missing_backend_fields
)


def check_intent_capability(intent):
    """
    Check whether the current backend can provide
    all information required by the intent.
    """

    required_fields = get_required_fields(intent)

    missing_fields = get_missing_backend_fields(
        intent
    )

    return {
        "intent": intent,
        "required_fields": required_fields,
        "missing_fields": missing_fields,
        "supported": len(missing_fields) == 0
    }