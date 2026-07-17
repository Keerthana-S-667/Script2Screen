"""Avatar Generation Route"""
from flask import Blueprint, request, jsonify
from services.avatar_generation_service import generate_avatar_video

avatar_bp = Blueprint("avatar", __name__)


@avatar_bp.route("/generate", methods=["POST"])
def generate():
    """Generate an avatar video from a script."""
    data = request.get_json()
    script = data.get("script", "")
    avatar_id = data.get("avatar_id", "default")

    if not script:
        return jsonify({"error": "Script is required"}), 400

    result = generate_avatar_video(script, avatar_id)
    return jsonify(result), 200


@avatar_bp.route("/upload", methods=["POST"])
def upload():
    """Upload a source video to create a custom avatar."""
    # Placeholder — file upload logic will be implemented
    return jsonify({"message": "Avatar upload endpoint (placeholder)"}), 200
