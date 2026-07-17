import requests, os, replicate
from dotenv import load_dotenv

load_dotenv()
try:
    print('Testing lucataco/sadtalker...')
    # Get latest version hash programmatically
    model = replicate.models.get('lucataco/sadtalker')
    version = model.latest_version.id
    print('Latest version:', version)

    output = replicate.run(
        f'lucataco/sadtalker:{version}',
        input={
            'source_image': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/source_image/full_body_1.png',
            'driven_audio': 'https://raw.githubusercontent.com/OpenTalker/SadTalker/main/examples/driven_audio/RD_Radio31_000.wav'
        }
    )
    print('Success:', output)
except Exception as e:
    import traceback
    print('Error from Replicate:')
    traceback.print_exc()

