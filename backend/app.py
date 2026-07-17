"""
Script2Screen — Flask Backend Entry Point
"""

from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

# Resolve the audio directory relative to this file
AUDIO_DIR = os.path.join(os.path.dirname(__file__), "audio")
os.makedirs(AUDIO_DIR, exist_ok=True)

app = Flask(__name__, static_folder="audio")

# Allow requests from any frontend origin during development
CORS(app)

# ── Register Blueprints (routes) ──────────────────────────────────────────────
from routes.script_routes import script_bp
from routes.avatar_routes import avatar_bp
from routes.caption_routes import caption_bp
from routes.translation_routes import translation_bp
from routes.video_routes import video_bp
from routes.voice_routes import voice_bp

app.register_blueprint(script_bp,      url_prefix="/api/script")
app.register_blueprint(avatar_bp,      url_prefix="/api/avatar")
app.register_blueprint(caption_bp,     url_prefix="/api/caption")
app.register_blueprint(translation_bp, url_prefix="/api/script")
app.register_blueprint(video_bp,       url_prefix="/api/video")
app.register_blueprint(voice_bp,       url_prefix="/api/voice")

# ── Serve generated audio files ───────────────────────────────────────────────
@app.route("/audio/<path:filename>")
def serve_audio(filename):
    """Serve TTS-generated MP3 files from the backend/audio directory."""
    return send_from_directory(AUDIO_DIR, filename)

# ── Health check ─────────────────────────────────────────────────────────────
@app.route("/api/health")
def health():
    return {"status": "ok", "service": "Script2Screen API"}, 200


if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    app.run(host="0.0.0.0", port=port, debug=debug)
