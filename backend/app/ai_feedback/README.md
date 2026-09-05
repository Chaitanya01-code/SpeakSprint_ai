# SpeakSprint AI - Scoring & AI Feedback

## Purpose

This module combines speaking-analysis results into a structured evaluation.

## Input Metrics

The scoring pipeline currently accepts these metrics, each represented as a score from 0 to 100:

- Grammar
- Fluency
- Vocabulary
- Pronunciation
- Speaking Speed
- Filler Words
- Topic Relevance

## Scoring Weights

| Metric | Weight |
|---|---:|
| Grammar | 15% |
| Fluency | 15% |
| Vocabulary | 15% |
| Pronunciation | 15% |
| Speaking Speed | 10% |
| Filler Words | 10% |
| Topic Relevance | 20% |

The weights total 100%.

## Final Score

The final score is calculated as a weighted average of the seven input scores.

The result is rounded to two decimal places and is on a scale of 0 to 100.

## Feedback

The module is designed to generate:

- Strengths
- Weaknesses
- Observations
- Actionable suggestions
- Overall feedback

## Current Status

The scoring and schema components have been implemented and basic independent checks have been completed.

Gemini integration is implemented through the Generative Language HTTPS API using `GEMINI_API_KEY`. The transcript workflow stores the structured evaluation on the same user-owned transcript record. If Gemini is unavailable, the local scoring pipeline supplies fallback feedback.

## Important Integration Note

Speaking speed and filler words may eventually be supplied as raw measurements rather than 0-100 scores. If that happens, normalization rules should be agreed upon before final integration.

## Testing

The `tests` folder contains tests for:

- Scoring
- Feedback prompts
- Scoring pipeline

Full project testing is currently separate from independent module testing because the existing project environment has a Python 3.14 and SQLAlchemy compatibility issue.