import requests, os, replicate
from dotenv import load_dotenv

load_dotenv()
try:
    print('Testing lucataco/sadtalker...')
    output = replicate.run(
        'lucataco/sadtalker:cc28e932bcebb12d1b64e0dd8eaedff1f893e3dc587c617c6692994ced9d1ce2',
        input={
            'source_image': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/source_image/full_body_1.png',
            'driven_audio': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/driven_audio/RD_Radio31_000.wav',
            'enhancer': 'gfpgan'
        }
    )
    print('Success:', output)
except Exception as e:
    import traceback
    print('Error from Replicate:')
    traceback.print_exc()

