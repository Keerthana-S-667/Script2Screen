"""Caption / Hashtag Generation Route"""
from flask import Blueprint, request, jsonify
from services.caption_generation_service import generate_captions

caption_bp = Blueprint("caption", __name__)


@caption_bp.route("/generate", methods=["POST"])
def generate():
    """Generate captions and hashtags for a given script/topic."""
    data = request.get_json()
    topic = data.get("topic", "")
    script = data.get("script", "")

    if not topic and not script:
        return jsonify({"error": "Topic or script is required"}), 400

    result = generate_captions(topic=topic, script=script)
    return jsonify(result), 200
