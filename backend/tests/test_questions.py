import sys
import os
import json

sys.path.append(
    os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            ".."
        )
    )
)

from main import understand_question


questions = [
    "Kal baarish hogi?",
    "Aaj weather kaisa hai?",
    "Aaj running ke liye best time kya hai?",
    "Mere kheth ke liye kal mausam kaisa rahega?",
    "Delhi ka weather kal kaisa hoga?",
    "AQI kaisa hai?",
    "Cyclone ki koi warning hai?",
    "Is it safe to travel to Patna tomorrow?",
    "Tomorrow's temperature in Mumbai?",
    "Kal office jaane ke time baarish hogi?",
    "Can I plan an outdoor event tomorrow?",
    "Beach jaane ke liye weather kaisa hai?",
    "Aaj humidity kitni hai?",
    "UV index kaisa hai?",
    "Mujhe asthma ke liye aaj weather safe hai?",
    "Will it be windy tomorrow?",
    "Yahan mausam kaisa hai?",
    "Mere area mein baarish kab hogi?",
    "Is tomorrow good for farming?",
    "Kolkata mein koi severe weather alert hai?"
]


for index, question in enumerate(questions, start=1):

    print("\n" + "=" * 60)

    print(f"TEST {index}")

    print("Question:")
    print(question)

    result = understand_question(question)

    print("\nOutput:")

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )