import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.translation_service import translate_script

try:
    print("Testing translation...")
    text = translate_script("Hello nice to meet you", "Tamil")
    print("SUCCESS!")
    print(text)
except Exception as e:
    import traceback
    traceback.print_exc()
