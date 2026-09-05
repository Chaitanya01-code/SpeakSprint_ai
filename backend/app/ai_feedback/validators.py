"""Validation helpers for AI scoring and feedback."""


def validate_score(score: float) -> float:
    """Ensure a score stays between 0 and 100."""
    if not 0 <= score <= 100:
        raise ValueError("Score must be between 0 and 100.")
    return score


def validate_feedback_list(items: list[str]) -> list[str]:
    """Ensure feedback items are non-empty strings."""
    if not isinstance(items, list):
        raise ValueError("Feedback must be provided as a list.")

    for item in items:
        if not isinstance(item, str) or not item.strip():
            raise ValueError("Feedback items must be non-empty strings.")

    return items