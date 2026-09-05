"""Transcript analysis orchestration with Gemini feedback and local fallback."""
import json
import os
import re
from collections import Counter
from typing import Any, Dict, Optional, Tuple
from urllib import error, request

from dotenv import load_dotenv

from ..ai_feedback.pipeline import run_scoring_pipeline
from ..ai_feedback.schemas import FinalEvaluation, SpeechAnalysisInput

_WORD_PATTERN = re.compile(r"\b[\w']+\b", re.UNICODE)
_FILLER_WORDS = {"um", "uh", "like", "you know", "actually", "basically", "so"}


def _score(value: float) -> float:
    return round(max(0.0, min(100.0, value)), 2)


def calculate_local_analysis(text: str, duration_seconds: int, topic: Optional[str]) -> Dict[str, Any]:
    words = _WORD_PATTERN.findall(text.lower())
    word_count = len(words)
    unique_count = len(set(words))
    duration = max(float(duration_seconds), 1.0)
    wpm = round(word_count / (duration / 60), 2)
    filler_count = sum(words.count(word) for word in _FILLER_WORDS if " " not in word)
    filler_rate = filler_count / word_count if word_count else 0.0
    vocabulary_score = _score((unique_count / word_count) * 100 if word_count else 0)
    fluency_score = _score(100 - abs(wpm - 130) * 0.5 if word_count else 0)
    speaking_speed_score = _score(100 - abs(wpm - 130) * 0.65 if word_count else 0)
    filler_score = _score(100 - filler_rate * 500)
    sentence_count = max(1, len(re.findall(r"[.!?]", text)))
    grammar_score = _score(100 - max(0, word_count / sentence_count - 35) * 1.5)

    relevance_score = None
    matched_topic_words = []
    if topic:
        topic_words = set(_WORD_PATTERN.findall(topic.lower()))
        matched_topic_words = sorted(topic_words.intersection(words))
        relevance_score = _score((len(matched_topic_words) / len(topic_words)) * 100 if topic_words else 0)

    scores = SpeechAnalysisInput(
        grammar=grammar_score,
        fluency=fluency_score,
        vocabulary=vocabulary_score,
        pronunciation=_score((fluency_score + grammar_score) / 2),
        speaking_speed=speaking_speed_score,
        filler_words=filler_score,
        topic_relevance=relevance_score if relevance_score is not None else 70,
    )
    return {
        "word_count": word_count,
        "unique_words": unique_count,
        "words_per_minute": wpm,
        "filler_words": filler_count,
        "filler_rate": round(filler_rate, 4),
        "keywords": [word for word, _ in Counter(words).most_common(10)],
        "matched_topic_words": matched_topic_words,
        "scores": scores.model_dump() if hasattr(scores, "model_dump") else scores.dict(),
        "topic": topic,
    }


def _fallback_evaluation(scores: SpeechAnalysisInput, analysis: Dict[str, Any]) -> FinalEvaluation:
    evaluation = run_scoring_pipeline(scores)
    skill_scores = evaluation.skill_scores
    strengths = []
    weaknesses = []
    suggestions = []
    if skill_scores.fluency >= 75:
        strengths.append("Your speaking pace and flow are easy to follow.")
    else:
        weaknesses.append("Your speaking pace is not yet consistent.")
        suggestions.append("Practice speaking in complete phrases with steady pauses.")
    if skill_scores.vocabulary >= 70:
        strengths.append("You used a varied set of words.")
    else:
        weaknesses.append("Your vocabulary variety can be expanded.")
        suggestions.append("Prepare three alternative words for common terms before practice.")
    if analysis["filler_words"]:
        weaknesses.append(f"{analysis['filler_words']} filler word(s) were detected.")
        suggestions.append("Replace filler words with a brief pause when gathering your thoughts.")
    if not strengths:
        strengths.append("You completed a speaking practice session.")
    if not weaknesses:
        weaknesses.append("Keep refining pronunciation and emphasis for an even stronger delivery.")
    if not suggestions:
        suggestions.append("Continue practicing and review your transcript for specific improvements.")
    return evaluation.model_copy(update={
        "strengths": strengths,
        "weaknesses": weaknesses,
        "observations": [f"You spoke at approximately {analysis['words_per_minute']} words per minute."],
        "suggestions": suggestions,
        "feedback": "Good work completing this speaking session. Use the suggestions above in your next practice round.",
    }) if hasattr(evaluation, "model_copy") else evaluation.copy(update={
        "strengths": strengths,
        "weaknesses": weaknesses,
        "observations": [f"You spoke at approximately {analysis['words_per_minute']} words per minute."],
        "suggestions": suggestions,
        "feedback": "Good work completing this speaking session. Use the suggestions above in your next practice round.",
    })


def _gemini_evaluation(base: FinalEvaluation, text: str, topic: Optional[str], analysis: Dict[str, Any]) -> Optional[FinalEvaluation]:
    load_dotenv()
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return None

    prompt = {
        "transcript": text,
        "topic": topic,
        "local_metrics": analysis,
        "base_evaluation": base.model_dump() if hasattr(base, "model_dump") else base.dict(),
        "instruction": "Return only JSON matching the FinalEvaluation schema. Scores must be numbers from 0 to 100. Keep each list concise.",
    }
    body = json.dumps({
        "contents": [{"parts": [{"text": json.dumps(prompt)}]}],
        "systemInstruction": {"parts": [{"text": "You are SpeakSprint AI, a precise and constructive English speaking coach."}]},
        "generationConfig": {"temperature": 0.2, "responseMimeType": "application/json"},
    }).encode("utf-8")
    endpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + api_key
    try:
        req = request.Request(endpoint, data=body, headers={"Content-Type": "application/json"}, method="POST")
        with request.urlopen(req, timeout=30) as response:
            payload = json.loads(response.read().decode("utf-8"))
        raw = payload["candidates"][0]["content"]["parts"][0]["text"]
        return FinalEvaluation.model_validate(json.loads(raw)) if hasattr(FinalEvaluation, "model_validate") else FinalEvaluation.parse_obj(json.loads(raw))
    except (KeyError, ValueError, TypeError, error.URLError, TimeoutError, json.JSONDecodeError):
        return None


def analyze_transcript(text: str, duration_seconds: int, topic: Optional[str]) -> Tuple[Dict[str, Any], FinalEvaluation]:
    analysis = calculate_local_analysis(text, duration_seconds, topic)
    score_input = SpeechAnalysisInput(**analysis["scores"])
    fallback = _fallback_evaluation(score_input, analysis)
    return analysis, _gemini_evaluation(fallback, text, topic, analysis) or fallback
