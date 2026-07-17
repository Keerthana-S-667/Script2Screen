"""Script Generation Route"""
from flask import Blueprint, request, jsonify
from services.script_service import generate_script

script_bp = Blueprint("script", __name__)


@script_bp.route("/generate", methods=["POST"])
def generate():
    """Generate a script from a given topic, tone, and duration."""
    data = request.get_json()
    topic = data.get("topic")
    tone = data.get("tone")
    duration = data.get("duration")

    if not topic or not tone or not duration:
        return jsonify({"error": "Topic, tone, and duration are required"}), 400

    try:
        generated_script = generate_script(topic, tone, duration)
        return jsonify({"script": generated_script}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
