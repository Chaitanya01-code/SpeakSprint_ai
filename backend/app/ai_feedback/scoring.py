"""Final scoring logic for SpeakSprint AI."""

from .schemas import SpeechAnalysisInput, SkillScores


# Weights must add up to 1.0
WEIGHTS = {
    "grammar": 0.15,
    "fluency": 0.15,
    "vocabulary": 0.15,
    "pronunciation": 0.15,
    "speaking_speed": 0.10,
    "filler_words": 0.10,
    "topic_relevance": 0.20,
}


def calculate_final_score(scores: SpeechAnalysisInput) -> float:
    """Calculate the overall score out of 100."""

    final_score = (
        scores.grammar * WEIGHTS["grammar"]
        + scores.fluency * WEIGHTS["fluency"]
        + scores.vocabulary * WEIGHTS["vocabulary"]
        + scores.pronunciation * WEIGHTS["pronunciation"]
        + scores.speaking_speed * WEIGHTS["speaking_speed"]
        + scores.filler_words * WEIGHTS["filler_words"]
        + scores.topic_relevance * WEIGHTS["topic_relevance"]
    )

    return round(final_score, 2)


def create_skill_scores(scores: SpeechAnalysisInput) -> SkillScores:
    """Convert input metrics into structured skill scores."""

    return SkillScores(
        grammar=scores.grammar,
        fluency=scores.fluency,
        vocabulary=scores.vocabulary,
        pronunciation=scores.pronunciation,
        speaking_speed=scores.speaking_speed,
        filler_words=scores.filler_words,
        topic_relevance=scores.topic_relevance,
    )