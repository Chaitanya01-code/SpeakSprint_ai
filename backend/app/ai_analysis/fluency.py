"""Fluency metrics for a transcribed speaking session."""

import math
import re
from typing import Any


_WORD_PATTERN = re.compile(r"\b[\w']+\b", re.UNICODE)


def calculate_fluency(transcript: str, duration_seconds: float) -> dict[str, Any]:
    """Calculate word count, words per minute, and a pace-based fluency score.

    ``duration_seconds`` should be the amount of time represented by the
    transcript. A score of 100 represents the target conversational pace of
    130 words per minute. The score decreases as the pace moves away from
    that target and is always bounded between 0 and 100.
    """
    if not isinstance(transcript, str):
        raise TypeError("transcript must be a string")
    if not math.isfinite(duration_seconds) or duration_seconds < 0:
        raise ValueError("duration_seconds must be a finite, non-negative number")

    words = _WORD_PATTERN.findall(transcript)
    word_count = len(words)

    if duration_seconds == 0 or word_count == 0:
        words_per_minute = 0.0
    else:
        words_per_minute = word_count / (duration_seconds / 60)

    target_wpm = 130.0
    fluency_score = (
        0.0
        if word_count == 0
        else max(0.0, 100.0 - abs(words_per_minute - target_wpm) * 0.5)
    )

    return {
        "words": words,
        "word_count": word_count,
        "words_per_minute": round(words_per_minute, 2),
        "fluency_score": round(fluency_score, 2),
    }
