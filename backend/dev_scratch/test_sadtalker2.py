import os, replicate
from dotenv import load_dotenv

load_dotenv()
try:
    print('Testing replicate model visibility...')
    output = replicate.run(
        'cjwbw/sadtalker',
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

