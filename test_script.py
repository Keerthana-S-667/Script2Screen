import sys
import os

# Add backend directory to sys.path so we can import services
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from services.script_service import generate_script

try:
    print("Testing script generation...")
    script = generate_script("dogs", "funny", "30 seconds")
    print("SUCCESS!")
    print(script)
except Exception as e:
    import traceback
    traceback.print_exc()
