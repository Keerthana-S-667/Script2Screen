import requests
import os
from dotenv import load_dotenv

load_dotenv()

url = 'https://api.sarvam.ai/translate'
headers = {'api-subscription-key': os.getenv('SARVAM_API_KEY'), 'Content-Type': 'application/json'}
payload = {'input': 'Hello', 'source_language_code': 'en-IN', 'target_language_code': 'ta-IN', 'speaker_gender': 'Male', 'mode': 'formal', 'model': 'sarvam-translate:v1', 'enable_preprocessing': True}
resp = requests.post(url, headers=headers, json=payload)
print(resp.json().keys())
print('Translation output:', repr(resp.json().get('translated_text')))
