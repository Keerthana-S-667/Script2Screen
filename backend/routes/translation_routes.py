"""Translation Route"""
from flask import Blueprint, request, jsonify
from services.translation_service import translate_script

translation_bp = Blueprint("translation", __name__)

@translation_bp.route("/translate", methods=["POST"])
def translate():
    """Translate a script into a target language."""
    data = request.get_json()
    script = data.get("script", "")
    language = data.get("language", "")

    if not script:
        return jsonify({"error": "Script is required"}), 400

    if not language:
        return jsonify({"error": "Language is required"}), 400

    try:
        translated_script = translate_script(script, language)
        return jsonify({"translated_script": translated_script}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
