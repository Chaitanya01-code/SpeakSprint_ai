"""Main scoring and feedback pipeline."""

from .scoring import calculate_final_score, create_skill_scores
from .schemas import FinalEvaluation, SpeechAnalysisInput


def run_scoring_pipeline(scores: SpeechAnalysisInput) -> FinalEvaluation:
    """Run the complete scoring pipeline."""

    overall_score = calculate_final_score(scores)
    skill_scores = create_skill_scores(scores)

    return FinalEvaluation(
        overall_score=overall_score,
        skill_scores=skill_scores,
        strengths=[],
        weaknesses=[],
        observations=[],
        suggestions=[],
        feedback="",
    )