"""
Script2Screen — Cloudinary Service
Handles uploading avatar images (base64 or URL) to Cloudinary for public hosting,
which is required by the Replicate SadTalker API.
"""

import os
import cloudinary
import cloudinary.uploader
import re

# Cloudinary configuration
# We expect these to be loaded via standard dotenv in app.py
CLOUDINARY_CLOUD_NAME = os.getenv("CLOUDINARY_CLOUD_NAME")
CLOUDINARY_API_KEY = os.getenv("CLOUDINARY_API_KEY")
CLOUDINARY_API_SECRET = os.getenv("CLOUDINARY_API_SECRET")

if CLOUDINARY_CLOUD_NAME and CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET:
    cloudinary.config(
        cloud_name=CLOUDINARY_CLOUD_NAME,
        api_key=CLOUDINARY_API_KEY,
        api_secret=CLOUDINARY_API_SECRET,
        secure=True
    )
else:
    print("[WARNING] Cloudinary credentials missing. Avatar upload will fail if attempted.")


def upload_avatar_image(image_data: str) -> str:
    """
    Uploads an image (either a base64 string or an external URL) to Cloudinary
    and returns a secure public URL.

    Args:
        image_data: A base64 encoded image string (e.g., 'data:image/jpeg;base64,...')
                    or a direct URL.

    Returns:
        str: The secure public URL of the uploaded image.
    """
    if not image_data:
        raise ValueError("No image data provided for upload.")

    # If it's already a public URL (http or https), we can just return it.
    # But usually it's safer to re-host to Cloudinary to ensure SadTalker can read it forever.
    # However, if it's explicitly a Cloudinary URL already, we return it to save bandwidth.
    if image_data.startswith("http") and "res.cloudinary.com" in image_data:
        return image_data

    try:
        # cloudinary handles both base64 data URIs and external URLs automatically!
        result = cloudinary.uploader.upload(
            image_data,
            folder="script2screen/avatars",
            resource_type="image"
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"[cloudinary_service] Upload error: {e}")
        raise RuntimeError(f"Failed to upload avatar to Cloudinary: {e}")


def upload_audio_file(file_path: str) -> str:
    """
    Uploads a local audio file to Cloudinary and returns a secure public URL.
    Required because Replicate cannot access localhost URLs.
    """
    if not os.path.exists(file_path):
        raise ValueError(f"Local audio file not found: {file_path}")
        
    try:
        # Cloudinary uses 'video' or 'raw' for audio files!
        result = cloudinary.uploader.upload(
            file_path,
            folder="script2screen/audio",
            resource_type="video" 
        )
        return result.get("secure_url")
    except Exception as e:
        print(f"[cloudinary_service] Audio upload error: {e}")
        raise RuntimeError(f"Failed to upload audio to Cloudinary: {e}")
