def analyze_behavior(text: str, behavior: dict | None = None) -> dict:
    behavior = behavior or {}
    words = [w for w in text.split() if w.strip()]
    filler_count = sum(1 for w in words if w.lower().strip('.,!?') in {"um", "uh", "like", "hmm", "erm"})
    pace = behavior.get("speaking_style", "normal")
    return {
        "word_count": len(words),
        "filler_count": filler_count,
        "speaking_style": pace,
        "confidence_signal": "steady" if filler_count <= 2 else "needs practice",
    }
