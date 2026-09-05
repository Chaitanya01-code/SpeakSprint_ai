"""Pydantic schemas for the AI scoring and feedback pipeline."""

from pydantic import BaseModel, Field


class SpeechAnalysisInput(BaseModel):
    """Input metrics collected from speech, audio, and NLP analysis."""

    grammar: float = Field(ge=0, le=100)
    fluency: float = Field(ge=0, le=100)
    vocabulary: float = Field(ge=0, le=100)
    pronunciation: float = Field(ge=0, le=100)
    speaking_speed: float = Field(ge=0, le=100)
    filler_words: float = Field(ge=0, le=100)
    topic_relevance: float = Field(ge=0, le=100)


class SkillScores(BaseModel):
    """Individual skill scores used in the final evaluation."""

    grammar: float
    fluency: float
    vocabulary: float
    pronunciation: float
    speaking_speed: float
    filler_words: float
    topic_relevance: float


class FinalEvaluation(BaseModel):
    """Structured result returned by the scoring and feedback pipeline."""

    overall_score: float = Field(ge=0, le=100)
    skill_scores: SkillScores
    strengths: list[str]
    weaknesses: list[str]
    observations: list[str]
    suggestions: list[str]
    feedback: str