"""
Script2Screen — Voice Generation Service (edge-tts)

Uses Microsoft Edge's neural TTS (no API key required).
Supports English, Tamil, Telugu, Hindi in Male and Female voices.
"""

import edge_tts
import asyncio
import os

# ── Voice map ────────────────────────────────────────────────────────────────
VOICE_MAP = {
    "english_female": "en-US-AriaNeural",
    "english_male":   "en-US-GuyNeural",
    "tamil_female":   "ta-IN-PallaviNeural",
    "tamil_male":     "ta-IN-ValluvarNeural",
    "hindi_female":   "hi-IN-SwaraNeural",
    "hindi_male":     "hi-IN-MadhurNeural",
    "telugu_female":  "te-IN-ShrutiNeural",
    "telugu_male":    "te-IN-MohanNeural",
}

# Frontend voice IDs use hyphens; normalise to underscores so both work
def _normalise_key(voice_key: str) -> str:
    return voice_key.replace("-", "_").lower()


AUDIO_DIR = os.path.join(os.path.dirname(__file__), "..", "audio")


async def _generate_async(script: str, voice_name: str, filepath: str) -> None:
    """Async edge-tts call — saves an MP3 to *filepath*."""
    communicate = edge_tts.Communicate(script, voice_name)
    await communicate.save(filepath)


def generate_voice(script: str, voice_key: str) -> str:
    """
    Convert *script* to speech using the voice identified by *voice_key*.

    Args:
        script:    Text to synthesise.
        voice_key: Key from VOICE_MAP (e.g. 'tamil_female' or 'tamil-female').

    Returns:
        Absolute path to the generated MP3 file.

    Raises:
        ValueError: if voice_key is unknown.
        RuntimeError: if edge-tts fails.
    """
    key = _normalise_key(voice_key)
    voice_name = VOICE_MAP.get(key)
    if not voice_name:
        raise ValueError(f"Unknown voice key: {voice_key!r}. Valid keys: {list(VOICE_MAP)}")

    os.makedirs(AUDIO_DIR, exist_ok=True)
    filename = f"voice_{key}.mp3"
    filepath = os.path.join(AUDIO_DIR, filename)

    try:
        asyncio.run(_generate_async(script, voice_name, filepath))
    except RuntimeError:
        # asyncio.run() raises RuntimeError if a loop is already running (e.g. Jupyter).
        # Fall back to nest_asyncio approach inside Flask (which shouldn't hit this).
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        try:
            loop.run_until_complete(_generate_async(script, voice_name, filepath))
        finally:
            loop.close()

    return filepath
