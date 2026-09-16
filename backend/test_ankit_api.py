import json

from weather.backend_client import search_location


city = input("Enter city name: ")

result = search_location(city)

print(
    json.dumps(
        result,
        indent=4
    )
)