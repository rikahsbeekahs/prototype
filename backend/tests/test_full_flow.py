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


from main import process_weather_question


test_questions = [
    "Kal mere kheth mein baarish hogi kya?",
    "Aaj running ke liye weather kaisa hai?",
    "Delhi ka weather kal kaisa hoga?",
    "Kal office jaane ke time baarish hogi?",
    "Can I plan an outdoor event tomorrow?",
    "Beach jaane ke liye weather kaisa hai?",
    "Aaj humidity kitni hai?",
    "Will it be windy tomorrow?"
]


for number, question in enumerate(
    test_questions,
    start=1
):

    print("\n" + "=" * 70)

    print(f"TEST {number}")

    print(f"QUESTION: {question}")

    result = process_weather_question(
        question,
        user_location="Muzaffarpur"
    )

    print("\nRESULT:")

    print(
        json.dumps(
            result,
            indent=4,
            ensure_ascii=False
        )
    )