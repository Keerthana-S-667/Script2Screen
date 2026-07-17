import sys
sys.path.append('c:\\Users\\skeer\\Script2Screen_2\\backend')
from services.translation_service import translate_script

print("Result:", translate_script("Hello world, how are you?", "ta"))
