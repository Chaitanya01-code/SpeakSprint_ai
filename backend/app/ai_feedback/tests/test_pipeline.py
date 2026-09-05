from app.ai_feedback.pipeline import run_scoring_pipeline
from app.ai_feedback.schemas import SpeechAnalysisInput


def test_run_scoring_pipeline():
    scores = SpeechAnalysisInput(
        grammar=80,
        fluency=75,
        vocabulary=70,
        pronunciation=85,
        speaking_speed=80,
        filler_words=90,
        topic_relevance=88,
    )

    result = run_scoring_pipeline(scores)

    assert 0 <= result.overall_score <= 100
    assert result.skill_scores.grammar == 80
    assert isinstance(result.strengths, list)
    assert isinstance(result.suggestions, list)