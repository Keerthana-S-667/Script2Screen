import requests
import time
import os
from dotenv import load_dotenv

load_dotenv()

url = 'https://api.d-id.com/talks'
auth = (os.getenv('DID_API_USER'), os.getenv('DID_API_SECRET'))

# Step 1: Create the talk
payload = {
    'script': {
        'type': 'audio',
        'audio_url': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/driven_audio/RD_Radio31_000.wav'
    },
    'source_url': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/source_image/full_body_1.png'
}

print('Creating D-ID Talk...')
response = requests.post(url, json=payload, auth=auth)
print(response.status_code, response.text)

if response.status_code == 201:
    talk_id = response.json().get('id')
    print(f'Talk ID: {talk_id}')

    # Step 2: Poll for completion
    while True:
        get_url = f'{url}/{talk_id}'
        res = requests.get(get_url, auth=auth).json()
        status = res.get('status')
        print(f'Status: {status}')
        if status == 'done':
            print('Success!', res.get('result_url'))
            break
        elif status == 'error':
            print('Error!', res)
            break
        time.sleep(3)
