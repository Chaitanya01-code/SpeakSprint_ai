"""AI feedback generation logic."""

import os

from dotenv import load_dotenv
from openai import OpenAI

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
    """Generate AI feedback using the OpenAI API."""

    # Read the API key from backend/.env
    load_dotenv()

    api_key = os.getenv("OPENAI_API_KEY")

    if not api_key:
        raise RuntimeError(
            "OPENAI_API_KEY is not set in the .env file."
        )

    # Create OpenAI client
    client = OpenAI(api_key=api_key)

    # Build the prompt using your existing function
    user_prompt = build_feedback_prompt(evaluation)

    # Send the prompt to OpenAI
    response = client.responses.create(
        model="gpt-4.1-mini",
        instructions=get_system_prompt(),
        input=user_prompt,
    )

    # Return the AI's text response
    return response.output_text