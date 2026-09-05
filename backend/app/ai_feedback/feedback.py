"""Gemini feedback generation helpers."""

import json
import os
from urllib import request

from dotenv import load_dotenv
from .prompts import FEEDBACK_SYSTEM_PROMPT, FEEDBACK_USER_PROMPT
from .schemas import FinalEvaluation


def build_feedback_prompt(evaluation: FinalEvaluation) -> str:
    """Build the user prompt from an evaluation."""

    scores = evaluation.skill_scores

    return FEEDBACK_USER_PROMPT.format(
        grammar=scores.grammar,
        fluency=scores.fluency,
        vocabulary=scores.vocabulary,
        pronunciation=scores.pronunciation,
        speaking_speed=scores.speaking_speed,
        filler_words=scores.filler_words,
        topic_relevance=scores.topic_relevance,
        overall_score=evaluation.overall_score,
    )


def get_system_prompt() -> str:
    """Return the system prompt used for AI feedback."""

    return FEEDBACK_SYSTEM_PROMPT


def generate_ai_feedback(evaluation: FinalEvaluation) -> str:
    """Generate concise feedback text with Gemini."""
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set in the .env file.")

    body = json.dumps({
        "contents": [{"parts": [{"text": build_feedback_prompt(evaluation)}]}],
        "systemInstruction": {"parts": [{"text": get_system_prompt()}]},
        "generationConfig": {"temperature": 0.2},
    }).encode("utf-8")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + api_key
    req = request.Request(endpoint, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with request.urlopen(req, timeout=30) as response:
        payload = json.loads(response.read().decode("utf-8"))
    return payload["candidates"][0]["content"]["parts"][0]["text"]