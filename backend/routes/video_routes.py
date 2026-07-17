"""
Script2Screen — Video Generation Routes
POST /api/video/generate  →  calls SadTalker via Replicate, returns video URL
"""

from flask import Blueprint, request, jsonify
from services.video_service import generate_avatar_video

video_bp = Blueprint("video", __name__)


@video_bp.route("/generate", methods=["POST"])
def generate():
    """Generate a talking avatar video from an image URL and an audio URL."""
    data = request.get_json()

    avatar_data = data.get("avatar_image") or data.get("avatar_url", "")
    if isinstance(avatar_data, str):
        avatar_data = avatar_data.strip()
    
    audio_url = data.get("audio_url", "").strip()

    if not avatar_data:
        return jsonify({"error": "avatar_image or avatar_url is required"}), 400
    if not audio_url:
        return jsonify({"error": "audio_url is required"}), 400

    try:
        video_url = generate_avatar_video(avatar_data, audio_url)
        return jsonify({"video_url": video_url}), 200
    except RuntimeError as e:
        # Pass through the exact Replicate limits/billing error instead of masking
        return jsonify({"error": str(e)}), 402
    except Exception as e:
        print(f"[video_routes] SadTalker error: {e}")
        return jsonify({"error": "Video generation failed. Please try again."}), 500
