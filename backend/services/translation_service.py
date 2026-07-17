import requests
import os
from dotenv import load_dotenv

load_dotenv()

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

def translate_script(script: str, language: str) -> str:
    url = "https://api.sarvam.ai/translate"

    headers = {
        "api-subscription-key": SARVAM_API_KEY,
        "Content-Type": "application/json"
    }
    
    lang_map = {
        "ta": "ta-IN",
        "te": "te-IN",
        "hi": "hi-IN"
    }
    target_code = lang_map.get(language, "hi-IN")

    payload = {
        "input": script,
        "source_language_code": "en-IN",
        "target_language_code": target_code,
        "speaker_gender": "Male",
        "mode": "formal",
        "model": "sarvam-translate:v1",
        "enable_preprocessing": True
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status() 
        response_json = response.json()
        return response_json.get("translated_text", "")
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error translating script: {e}")
        if e.response is not None:
             print(f"Response body: {e.response.text}")
        return ""
    except Exception as e:
        print(f"Error translating script: {e}")
        return ""
