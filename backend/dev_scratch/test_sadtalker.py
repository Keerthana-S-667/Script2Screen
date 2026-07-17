import os, replicate
from dotenv import load_dotenv

load_dotenv()
token = os.environ.get('REPLICATE_API_TOKEN')
print(f'Token length: {len(token) if token else 0}')

try:
    print('Testing replicate model visibility...')
    # Use a dummy source image and driven audio that are publicly available just to test API connectivity or parameter issues
    output = replicate.run(
        'cjwbw/sadtalker:3aa3dac9353cc4d6bd62a8f508cb33281a6e0f49c00b5ec983ecfa4f73809e07',
        input={
            'source_image': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/source_image/full_body_1.png',
            'driven_audio': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/driven_audio/RD_Radio31_000.wav',
            'use_enhancer': True,
        }
    )
    print('Success:', output)
except Exception as e:
    import traceback
    print('Error from Replicate:')
    traceback.print_exc()

