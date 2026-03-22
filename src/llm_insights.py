import requests
import os
from dotenv import load_dotenv
load_dotenv()
API_KEY = os.getenv("API_KEY")


def generate_insights(data, prediction, what_if):

    prompt = f"""
    You are a running coach.

    User data:
    {data}

    Predicted marathon time: {prediction} minutes

    What-if analysis:
    {what_if}

    Give:
    - Short summary
    - 2-3 suggestions
    - Simple advice

    Keep it short and practical.
    """

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "model": "meta-llama/llama-3.1-70b-instruct",
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    result = response.json()
    return result["choices"][0]["message"]["content"]