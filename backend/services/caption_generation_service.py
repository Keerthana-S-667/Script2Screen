"""
Caption & Hashtag Generation Service — Placeholder

Future implementation will use an LLM to generate engaging social-media
captions and relevant hashtags from a topic or script.
"""


def generate_captions(topic: str = "", script: str = "") -> dict:
    """
    Generate captions and hashtags.

    Args:
        topic:  The content topic.
        script: The generated script (optional, for better context).

    Returns:
        dict with 'caption' and 'hashtags' keys.
    """
    # TODO: Replace with actual LLM API call
    subject = topic or script[:60]
    return {
        "caption": f"[PLACEHOLDER] Check out this amazing video about {subject}! 🚀",
        "hashtags": ["#Script2Screen", "#AIVideo", "#ContentCreator", "#Reels", "#Shorts"],
        "status": "placeholder",
    }
