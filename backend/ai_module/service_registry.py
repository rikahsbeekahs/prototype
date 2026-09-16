# ai_module/service_registry.py


SERVICE_REGISTRY = {

    "weather": {
        "route": "/weather",
        "description": "Current weather information"
    },

    "forecast": {
        "route": "/forecast",
        "description": "Weather forecast information"
    },

    "aqi": {
        "route": "/aqi",
        "description": "Air quality information"
    },

    "alerts": {
        "route": "/alerts",
        "description": "Weather alerts and warnings"
    },

    "radar": {
        "route": "/radar",
        "description": "Weather radar"
    },

    "cyclone": {
        "route": "/cyclone",
        "description": "Cyclone information and tracking"
    },

    "agromet": {
        "route": "/agromet",
        "description": "Agricultural weather information"
    },

    "map": {
        "route": "/map",
        "description": "Weather map and geographic information"
    }
}


SUPPORTED_SERVICES = list(
    SERVICE_REGISTRY.keys()
)


SUPPORTED_ACTIONS = [
    "navigate",
    "answer",
    "navigate_or_answer",
    "unknown"
]


def get_service_route(service):
    """
    Return the route associated with a service.
    """

    service_data = SERVICE_REGISTRY.get(
        service
    )

    if not service_data:
        return None

    return service_data["route"]


def is_valid_service(service):
    """
    Check whether a service exists
    in the current service registry.
    """

    return service in SUPPORTED_SERVICES


def is_valid_action(action):
    """
    Check whether an action is supported.
    """

    return action in SUPPORTED_ACTIONS