"""
Script2Screen — Voice Generation Routes

POST /api/voice/generate
    Body:  { "script": "...", "voice": "tamil_female" }
    Returns: { "audio_url": "http://localhost:5000/audio/voice_tamil_female.mp3" }
"""

from flask import Blueprint, request, jsonify
from services.voice_service import generate_voice, VOICE_MAP

voice_bp = Blueprint("voice", __name__)

BASE_AUDIO_URL = "http://localhost:5000/audio"


@voice_bp.route("/generate", methods=["POST"])
def generate():
    """Generate speech audio and return a playable URL."""
    data = request.get_json(force=True) or {}

    script    = (data.get("script") or "").strip()
    voice_key = (data.get("voice")  or "").strip()

    if not script:
        return jsonify({"error": "script is required"}), 400
    if not voice_key:
        return jsonify({"error": "voice is required"}), 400

    key_normalised = voice_key.replace("-", "_").lower()
    if key_normalised not in VOICE_MAP:
        return jsonify({
            "error": f"Unknown voice: {voice_key!r}",
            "valid_voices": list(VOICE_MAP.keys()),
        }), 400

    try:
        generate_voice(script, voice_key)
        filename  = f"voice_{key_normalised}.mp3"
        audio_url = f"{BASE_AUDIO_URL}/{filename}"
        return jsonify({"audio_url": audio_url}), 200

    except Exception as e:
        print(f"[voice_routes] TTS error: {e}")
        return jsonify({"error": "Voice generation failed. Please try again."}), 500


@voice_bp.route("/voices", methods=["GET"])
def list_voices():
    """Return all available voices."""
    return jsonify({"voices": list(VOICE_MAP.keys())}), 200
