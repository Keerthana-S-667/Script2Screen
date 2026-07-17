import requests, os
from dotenv import load_dotenv

load_dotenv()
token = os.environ.get('REPLICATE_API_TOKEN')

# Test alternative SadTalker models on Replicate
for model in ['lucataco/sadtalker', 'fictions-ai/sadtalker']:
    resp = requests.get(f'https://api.replicate.com/v1/models/{model}', headers={'Authorization': f'Token {token}'})
    print(f'{model}: {resp.status_code}')

