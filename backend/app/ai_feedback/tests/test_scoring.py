from app.ai_feedback.schemas import SpeechAnalysisInput
from app.ai_feedback.scoring import calculate_final_score


def test_calculate_final_score():
    scores = SpeechAnalysisInput(
        grammar=80,
        fluency=70,
        vocabulary=75,
        pronunciation=85,
        speaking_speed=90,
        filler_words=80,
        topic_relevance=95,
    )

    result = calculate_final_score(scores)

    assert 0 <= result <= 100