import requests
import os
from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")



def generate_script(topic, tone, duration):
    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    prompt = f"""
Write a {duration} engaging social media video script about {topic}.
Tone: {tone}.
Make it suitable for YouTube Shorts or Instagram Reels.
"""

    data = {
        "model": "llama-3.1-8b-instant",
        "messages": [
            {
                "role": "system",
                "content": "You are an expert script writer for short social media videos."
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    }

    response = requests.post(url, headers=headers, json=data)

    response_json = response.json()

    return response_json["choices"][0]["message"]["content"]
