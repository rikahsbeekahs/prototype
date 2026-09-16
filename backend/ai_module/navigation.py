# ai_module/navigation.py


from ai_module.service_registry import (
    get_service_route
)


def decide_navigation(
    understanding
):

    service = understanding.get(
        "service"
    )

    action = understanding.get(
        "action"
    )

    route = get_service_route(
        service
    )


    if action == "navigate":

        return {
            "decision": "navigate",
            "service": service,
            "route": route
        }


    if action == "answer":

        return {
            "decision": "answer",
            "service": service,
            "route": None
        }


    if action == "navigate_or_answer":

        return {
            "decision": "navigate_or_answer",
            "service": service,
            "route": route
        }


    return {
        "decision": "unknown",
        "service": service,
        "route": None
    }