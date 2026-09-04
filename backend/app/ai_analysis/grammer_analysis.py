from __future__ import annotations

from collections import Counter
from typing import Any, Dict, List, Optional

import spacy
from textblob import TextBlob
import language_tool_python
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# ============================== CONFIG ====================================

SPACY_MODEL = "en_core_web_sm"
LANGUAGE = "en-US"

MAX_KEYWORDS = 15
MAX_REPEATED_WORDS = 10
MAX_GRAMMAR_DETAILS = 10
MAX_SUGGESTIONS = 3

# Project-defined grammar score:
# Start at 100 and subtract 2 points per grammar error per 100 words.
# The result is clamped to [0, 100].
GRAMMAR_PENALTY_PER_ERROR_PER_100_WORDS = 2.0

# Topic relevance:
# 70% TF-IDF cosine similarity + 30% meaningful keyword overlap.
TOPIC_COSINE_WEIGHT = 0.70
TOPIC_OVERLAP_WEIGHT = 0.30


# =========================== NLP MODEL ====================================

try:
    # Member 7 does not need dependency parsing or NER for the required
    # metrics. Disabling them reduces unnecessary processing.
    nlp = spacy.load(
        SPACY_MODEL,
        disable=["parser", "ner", "textcat"],
    )
except OSError as exc:
    raise RuntimeError(
        f"spaCy model '{SPACY_MODEL}' is missing. Run:\n"
        f"python -m spacy download {SPACY_MODEL}"
    ) from exc

_grammar_tool = None


def _get_grammar_tool():
    """Create LanguageTool once and reuse it for later requests."""
    global _grammar_tool
    if _grammar_tool is None:
        _grammar_tool = language_tool_python.LanguageTool(LANGUAGE)
    return _grammar_tool


# ========================== PREPROCESSING =================================

def _clean_tokens(doc) -> List[str]:
    """Return normalized content words from an already parsed spaCy Doc."""
    return [
        token.lemma_.lower()
        for token in doc
        if token.is_alpha
        and not token.is_stop
        and not token.is_punct
        and token.lemma_.strip()
    ]


def preprocess(text: str):
    """Parse transcript once and return both the Doc and cleaned tokens."""
    doc = nlp(text)
    return doc, _clean_tokens(doc)


# ========================== KEYWORDS ======================================

def extract_keywords(doc, limit: int = MAX_KEYWORDS) -> List[str]:
    """
    Extract and rank important keywords.

    Nouns/proper nouns receive priority because they usually represent
    topics and concepts. Adjectives are included as supporting keywords.
    """
    counts = Counter()

    for token in doc:
        if (
            token.is_alpha
            and not token.is_stop
            and token.lemma_.strip()
            and token.pos_ in {"NOUN", "PROPN", "ADJ"}
        ):
            counts[token.lemma_.lower()] += 1

    # Frequency is the primary ranking; longer terms win ties.
    ranked = sorted(
        counts.items(),
        key=lambda item: (-item[1], -len(item[0]), item[0]),
    )
    return [word for word, _ in ranked[:limit]]


# ========================== VOCABULARY ====================================

def analyze_vocabulary(tokens: List[str]) -> Dict[str, Any]:
    """
    Calculate vocabulary size, diversity and repetition statistics.

    total_words      = total meaningful word tokens
    unique_words     = distinct meaningful words
    repeated_words   = token occurrences beyond the first occurrence
    repetition_rate  = repeated_words / total_words
    """
    total = len(tokens)
    counts = Counter(tokens)
    unique = len(counts)
    repeated = max(0, total - unique)
    repeated_types = sum(1 for count in counts.values() if count > 1)

    diversity = unique / total if total else 0.0
    repetition_rate = repeated / total if total else 0.0

    return {
        "total_words": total,
        "unique_words": unique,
        "repeated_words": repeated,
        "repeated_word_types": repeated_types,
        "lexical_diversity": round(diversity, 4),
        "repetition_rate": round(repetition_rate, 4),
        "most_common": counts.most_common(MAX_REPEATED_WORDS),
        "repeated_word_frequency": [
            {"word": word, "count": count}
            for word, count in counts.most_common(MAX_REPEATED_WORDS)
            if count > 1
        ],
    }


# =========================== SENTIMENT ====================================

def analyze_sentiment(text: str) -> Dict[str, Any]:
    """Return sentiment label, polarity and subjectivity."""
    sentiment = TextBlob(text).sentiment
    polarity = float(sentiment.polarity)
    subjectivity = float(sentiment.subjectivity)

    # Small neutral band avoids over-classifying near-zero values.
    if polarity > 0.05:
        label = "Positive"
    elif polarity < -0.05:
        label = "Negative"
    else:
        label = "Neutral"

    return {
        "label": label,
        "polarity": round(polarity, 4),
        "subjectivity": round(subjectivity, 4),
    }


# ============================ GRAMMAR ====================================

def check_grammar(
    text: str,
    total_words: int,
    max_details: int = MAX_GRAMMAR_DETAILS,
) -> Dict[str, Any]:
    """
    Detect grammatical issues and calculate a project-defined 0-100 score.

    Score formula:
        100 - (errors / words * 100 * penalty)

    The score is clamped between 0 and 100. This is an explicit project
    criterion and can be changed later by the team without changing the
    rest of the NLP pipeline.
    """
    tool = _get_grammar_tool()
    matches = tool.check(text)

    score = 100.0
    if total_words:
        error_rate_per_100 = (len(matches) / total_words) * 100
        score -= error_rate_per_100 * GRAMMAR_PENALTY_PER_ERROR_PER_100_WORDS

    score = max(0.0, min(100.0, score))

    details = []
    for match in matches[:max_details]:
        details.append(
            {
                "message": match.message,
                "suggestions": match.replacements[:MAX_SUGGESTIONS],
                "offset": getattr(match, "offset", None),
                "length": getattr(match, "errorLength", None),
                "rule_id": getattr(match, "ruleId", None),
            }
        )

    return {
        "errors": len(matches),
        "grammar_score": round(score, 2),
        "details": details,
    }


# ========================== TOPIC RELEVANCE ===============================

def _topic_keywords(topic: str) -> set[str]:
    """Get meaningful topic terms using the same spaCy model."""
    topic_doc = nlp(topic)
    return {
        token.lemma_.lower()
        for token in topic_doc
        if token.is_alpha
        and not token.is_stop
        and token.lemma_.strip()
    }


def calculate_topic_relevance(
    text: str,
    topic: Optional[str],
    tokens: List[str],
) -> Dict[str, Any]:
    """
    Measure how closely a transcript matches its assigned topic.

    Relevance score:
        70% TF-IDF cosine similarity
        30% meaningful topic-keyword overlap

    Returns a 0-100 score and component scores. If no topic is supplied,
    relevance is marked unavailable rather than inventing a score.
    """
    if not topic or not topic.strip():
        return {
            "score": None,
            "tfidf_similarity": None,
            "keyword_overlap": None,
            "matched_topic_keywords": [],
            "topic": None,
        }

    topic = topic.strip()
    topic_terms = _topic_keywords(topic)
    token_set = set(tokens)

    if not topic_terms:
        return {
            "score": 0.0,
            "tfidf_similarity": 0.0,
            "keyword_overlap": 0.0,
            "matched_topic_keywords": [],
            "topic": topic,
        }

    # Fit only on the two texts being compared. This keeps the calculation
    # lightweight and requires no external training dataset.
    vectorizer = TfidfVectorizer(
        lowercase=True,
        token_pattern=r"(?u)\b[a-zA-Z][a-zA-Z]+\b",
        ngram_range=(1, 2),
    )
    matrix = vectorizer.fit_transform([topic, text])
    similarity = float(cosine_similarity(matrix[0:1], matrix[1:2])[0][0])

    matched = sorted(topic_terms & token_set)
    overlap = len(matched) / len(topic_terms)

    score = (
        TOPIC_COSINE_WEIGHT * similarity
        + TOPIC_OVERLAP_WEIGHT * overlap
    ) * 100

    return {
        "score": round(min(100.0, max(0.0, score)), 2),
        "tfidf_similarity": round(similarity, 4),
        "keyword_overlap": round(overlap, 4),
        "matched_topic_keywords": matched,
        "topic": topic,
    }


# ========================= COMPLETE PIPELINE ==============================

def analyze_text(text: str, topic: Optional[str] = None) -> Dict[str, Any]:
    """
    Run all NLP analysis and return a structured result.

    Parameters:
        text:  cleaned/generated speech transcript
        topic: assigned speech topic

    This is the main function Member 8 can call from the final scoring
    engine or an API layer.
    """
    text = " ".join(text.split())

    if not text:
        raise ValueError("Transcript must not be empty.")

    doc, tokens = preprocess(text)

    vocabulary = analyze_vocabulary(tokens)

    result = {
        "text": text,
        "topic": topic,
        "keywords": extract_keywords(doc),
        "sentiment": analyze_sentiment(text),
        "grammar": check_grammar(
            text,
            total_words=vocabulary["total_words"],
        ),
        "vocabulary": vocabulary,
        "relevance": calculate_topic_relevance(
            text,
            topic,
            tokens,
        ),
    }

    # Convenient top-level scores for the final scoring engine.
    result["scores"] = {
        "grammar": result["grammar"]["grammar_score"],
        "topic_relevance": result["relevance"]["score"],
    }

    return result


# ============================== DISPLAY ===================================

def _section(title: str) -> None:
    print(f"\n{title}")
    print("-" * 60)


def display_results(result: Dict[str, Any]) -> None:
    """Human-readable console output for testing/demo purposes."""
    print("\n" + "=" * 60)
    print("                 SPEAKSPRINT AI")
    print("                  NLP ANALYSIS")
    print("=" * 60)

    _section("TOPIC RELEVANCE")
    relevance = result["relevance"]
    if relevance["score"] is None:
        print("Topic           : Not provided")
        print("Relevance Score : Not available")
    else:
        print(f"Topic           : {relevance['topic']}")
        print(f"Relevance Score : {relevance['score']:.2f}/100")
        print(f"TF-IDF Match    : {relevance['tfidf_similarity']:.2f}")
        print(f"Keyword Overlap : {relevance['keyword_overlap']:.2f}")
        print(
            "Matched Terms   : "
            + (", ".join(relevance["matched_topic_keywords"]) or "None")
        )

    _section("GRAMMAR")
    grammar = result["grammar"]
    print(f"Grammar Score   : {grammar['grammar_score']:.2f}/100")
    print(f"Errors Found    : {grammar['errors']}")
    for i, error in enumerate(grammar["details"], start=1):
        print(f"  {i}. {error['message']}")
        if error["suggestions"]:
            print("     Suggestions: " + ", ".join(error["suggestions"]))

    _section("VOCABULARY")
    vocabulary = result["vocabulary"]
    print(f"Total Words           : {vocabulary['total_words']}")
    print(f"Unique Words          : {vocabulary['unique_words']}")
    print(f"Repeated Words        : {vocabulary['repeated_words']}")
    print(f"Repeated Word Types   : {vocabulary['repeated_word_types']}")
    print(f"Lexical Diversity     : {vocabulary['lexical_diversity']:.2f}")
    print(f"Repetition Rate       : {vocabulary['repetition_rate']:.2f}")

    print("\nRepeated Word Frequency:")
    repeated = vocabulary["repeated_word_frequency"]
    if repeated:
        for item in repeated:
            print(f"  {item['word']}: {item['count']}")
    else:
        print("  None")

    _section("KEYWORDS")
    print(", ".join(result["keywords"]) or "None found")

    _section("SENTIMENT")
    sentiment = result["sentiment"]
    print(f"Label        : {sentiment['label']}")
    print(f"Polarity     : {sentiment['polarity']:.2f}")
    print(f"Subjectivity : {sentiment['subjectivity']:.2f}")

    _section("FINAL NLP SCORES")
    print(f"Grammar        : {result['scores']['grammar']:.2f}/100")
    relevance_score = result["scores"]["topic_relevance"]
    if relevance_score is None:
        print("Topic Relevance: Not available")
    else:
        print(f"Topic Relevance: {relevance_score:.2f}/100")


# ============================== DEMO ======================================

def main() -> None:
    print("=" * 60)
    print("              SPEAKSPRINT AI - NLP TEST")
    print("=" * 60)

    topic = input("\nAssigned topic: ").strip()
    text = input("\nEnter/paste the speech transcript:\n").strip()

    if not text:
        print("Error: No transcript provided.")
        return

    try:
        result = analyze_text(text, topic or None)
        display_results(result)
    except Exception as exc:
        print(f"\nNLP analysis failed: {exc}")


if __name__ == "__main__":
    main()
