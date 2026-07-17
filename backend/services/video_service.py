"""
Script2Screen — Video Generation Service
Uses the Replicate SadTalker model to generate a lip-synced talking avatar video
from a source image and a driven audio file.
"""

import os
import time
import requests
from urllib.parse import urlparse
from dotenv import load_dotenv
from services.cloudinary_service import upload_avatar_image, upload_audio_file

load_dotenv()

# ── D-ID API Credentials ───────────────────────────────────────────────────────
DID_API_USER = os.getenv("DID_API_USER")
DID_API_SECRET = os.getenv("DID_API_SECRET")

def generate_avatar_video(avatar_data: str, audio_url: str) -> str:
    """
    Generate a lip-synced talking avatar video using SadTalker on Replicate.

    Args:
        avatar_data: Base64 data URI of the avatar image OR a public URL.
        audio_url: Publicly accessible URL of the driven audio file.

    Returns:
        URL string of the generated video.

    Raises:
        Exception: Propagates any Replicate API errors to the caller.
    """
    # 1. Upload avatar to Cloudinary to ensure it's a perpetually public URL
    print("[video_service] Uploading avatar to Cloudinary...")
    public_avatar_url = upload_avatar_image(avatar_data)
    print(f"[video_service] Avatar uploaded: {public_avatar_url}")

    # 1.5 Handle localhost audio URLs (must be uploaded to Cloudinary so Replicate can access it)
    if "localhost:" in audio_url or "127.0.0.1:" in audio_url:
        print("[video_service] Local audio URL detected, uploading to Cloudinary...")
        parsed = urlparse(audio_url)
        # Convert /audio/something.mp3 to local path backend/audio/something.mp3
        local_path = os.path.join(os.getcwd(), parsed.path.lstrip("/"))
        if os.path.exists(local_path):
            audio_url = upload_audio_file(local_path)
            print(f"[video_service] Audio uploaded successfully: {audio_url}")
        else:
            print(f"[WARNING] Local audio file not found at {local_path}. Replicate will fail!")
            
    # 2. Call D-ID Talks API
    print(f"[video_service] Calling D-ID API with audio_url: {audio_url}")
    
    url = "https://api.d-id.com/talks"
    auth = (DID_API_USER, DID_API_SECRET)
    
    payload = {
        "script": {
            "type": "audio",
            "audio_url": audio_url
        },
        "source_url": public_avatar_url,
        "config": {
            "fluent": "false",
            "pad_audio": "0.0"
        }
    }
    
    try:
        # Step 2.1: Start generation
        response = requests.post(url, json=payload, auth=auth)
        if response.status_code != 201:
            err = response.json()
            print(f"[video_service] D-ID Error: {err}")
            raise RuntimeError(f"D-ID API Rejected payload: {err.get('message', response.text)}")
            
        talk_id = response.json().get('id')
        print(f"[video_service] D-ID Talk started successfully. Polling ID: {talk_id}")
        
        # Step 2.2: Poll for completion
        while True:
            res = requests.get(f"{url}/{talk_id}", auth=auth).json()
            status = res.get('status')
            
            if status == 'done':
                video_url = res.get('result_url')
                print(f"[video_service] D-ID Generation complete! URL: {video_url}")
                return video_url
                
            elif status == 'error' or status == 'rejected':
                error_msg = res.get('last_error', {}).get('message', 'Unknown error')
                raise RuntimeError(f"D-ID Generation Failed: {error_msg}")
            
            print(f"[video_service] Status: {status}... waiting 3 seconds.")
            time.sleep(3)

    except Exception as e:
        print(f"\n[ERROR] VIDEO GENERATION FAILURE: {e}")
        import traceback
        traceback.print_exc()
        raise RuntimeError(f"Failed to generate video: {str(e)}")
