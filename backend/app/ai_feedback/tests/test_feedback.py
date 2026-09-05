from app.ai_feedback.feedback import get_system_prompt


def test_system_prompt_exists():
    prompt = get_system_prompt()

    assert isinstance(prompt, str)
    assert len(prompt) > 0
