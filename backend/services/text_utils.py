import re
from collections import Counter

TECH_KEYWORDS = ["python","java","javascript","typescript","react","node","express","fastapi","django","flask","html","css","tailwind","sql","postgresql","mysql","mongodb","redis","sqlite","aws","azure","docker","kubernetes","linux","git","rest","api","graphql","websocket","jwt","oauth","machine learning","pandas","numpy","scikit-learn","data structures","algorithms","oop","testing"]
ACTION_VERBS = ["built","developed","designed","implemented","optimized","deployed","created","improved","automated","integrated","reduced","increased","led","delivered","tested","debugged"]
STOP_WORDS = {"the","and","for","with","that","this","from","your","you","are","our","will","have","has","was","were","been","their","they","them","into","using","use","used","work","working","experience","skills","ability","role","team"}


def normalize(text: str) -> str:
    return re.sub(r"\s+", " ", (text or "").strip())


def keyword_hits(text: str, keywords: list[str] | None = None) -> list[str]:
    low = (text or "").lower()
    return sorted({kw for kw in (keywords or TECH_KEYWORDS) if re.search(rf"(?<![a-z0-9]){re.escape(kw)}(?![a-z0-9])", low)})


def top_terms(text: str, limit: int = 20) -> list[str]:
    words = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.\-]{1,}", (text or "").lower())
    words = [w for w in words if w not in STOP_WORDS and len(w) > 2]
    return [w for w, _ in Counter(words).most_common(limit)]


def bullet_lines(text: str) -> list[str]:
    return [line.strip() for line in (text or "").splitlines() if line.strip().startswith(("-", "•", "*"))]


def count_action_verbs(text: str) -> int:
    low = (text or "").lower()
    return sum(len(re.findall(rf"\b{re.escape(v)}\b", low)) for v in ACTION_VERBS)


def numbers_count(text: str) -> int:
    return len(re.findall(r"\b\d+(\.\d+)?%?\b", text or ""))
