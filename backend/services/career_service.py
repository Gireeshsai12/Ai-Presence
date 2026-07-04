from services.text_utils import TECH_KEYWORDS, ACTION_VERBS, bullet_lines, count_action_verbs, keyword_hits, normalize, numbers_count, top_terms


def score_resume(resume_text: str, target_role: str | None = None) -> dict:
    clean = normalize(resume_text)
    keywords = keyword_hits(clean, TECH_KEYWORDS)
    bullets = bullet_lines(resume_text)
    metrics = numbers_count(resume_text)
    actions = count_action_verbs(resume_text)
    lower = clean.lower()

    sections = {
        "education": any(x in lower for x in ["education", "university", "college", "bachelor", "master"]),
        "skills": any(x in lower for x in ["skills", "technical skills", "technologies"]),
        "projects": any(x in lower for x in ["project", "projects"]),
        "experience": any(x in lower for x in ["experience", "intern", "employment", "work"]),
    }

    length_score = min(15, max(5, len(clean.split()) // 35))
    keyword_score = min(30, len(keywords) * 3)
    section_score = min(20, sum(sections.values()) * 5)
    bullet_score = min(15, len(bullets) * 2)
    impact_score = min(20, metrics * 5 + actions * 2)
    score = min(100, length_score + keyword_score + section_score + bullet_score + impact_score)

    missing_keywords = [kw for kw in TECH_KEYWORDS if kw not in keywords][:14]

    weak_bullets = []
    for b in bullets[:10]:
        low = b.lower()
        has_action = any(v in low for v in ACTION_VERBS)
        has_metric = any(ch.isdigit() for ch in b)
        if not has_action or not has_metric:
            weak_bullets.append({
                "original": b,
                "issue": "Add action verb and measurable impact." if not has_action and not has_metric else "Add measurable impact." if not has_metric else "Start with stronger action verb.",
                "rewrite_formula": "Built/Implemented [feature] using [technology], improving [metric/result] by [number].",
            })

    return {
        "ats_score": score,
        "target_role": target_role or "Software Engineer",
        "detected_keywords": keywords,
        "missing_keywords": missing_keywords,
        "sections_detected": sections,
        "missing_sections": [k for k, v in sections.items() if not v],
        "bullet_count": len(bullets),
        "metric_count": metrics,
        "action_verb_count": actions,
        "top_terms": top_terms(resume_text, 18),
        "weak_bullets": weak_bullets,
        "strengths": [
            f"Detected {len(keywords)} technical keywords.",
            f"Detected {len(bullets)} resume bullets.",
            f"Detected {metrics} measurable metrics.",
            "Resume has core sections." if sum(sections.values()) >= 3 else "Resume needs clearer section headings.",
        ],
        "improvements": [
            "Add measurable outcomes to every strong project bullet.",
            "Tailor technical skills to each job description.",
            "Start bullets with action verbs such as Built, Implemented, Optimized, Deployed.",
            "Use this formula: Action + Technology + Result.",
        ],
        "next_actions": [
            "Paste a job description in JD Analyzer.",
            "Add missing keywords naturally if you truly know them.",
            "Rewrite weak bullets with metrics.",
        ],
    }


def analyze_jd(job_description: str, resume_text: str | None = None) -> dict:
    jd_keywords = keyword_hits(job_description, TECH_KEYWORDS)
    resume_keywords = keyword_hits(resume_text or "", TECH_KEYWORDS)
    matched = sorted(set(jd_keywords) & set(resume_keywords))
    missing = sorted(set(jd_keywords) - set(resume_keywords))
    match = int((len(matched) / max(1, len(jd_keywords))) * 100)

    seniority = "entry"
    low = job_description.lower()
    if any(x in low for x in ["senior", "5+ years", "7+ years"]):
        seniority = "senior"
    elif any(x in low for x in ["mid", "3+ years", "4+ years"]):
        seniority = "mid"

    return {
        "match_score": match,
        "seniority_detected": seniority,
        "required_keywords": jd_keywords,
        "matched_keywords": matched,
        "missing_keywords": missing,
        "jd_top_terms": top_terms(job_description, 18),
        "roadmap": [
            {
                "skill": s,
                "plan": f"Build one small feature or mini-project using {s}, then add one truthful resume bullet.",
                "time_estimate": "2-5 days for basic portfolio-level proof",
            }
            for s in missing[:8]
        ],
        "resume_tailoring_suggestions": [
            "Move the most relevant skills near the top.",
            "Mirror exact JD keywords only when they truthfully match your experience.",
            "Add one project bullet that proves the top missing skill.",
        ],
        "recommendation": "Strong fit. Apply and tailor resume." if match >= 75 else "Possible fit. Tailor resume before applying." if match >= 50 else "Low match. Close keyword gaps first.",
    }


def evaluate_star(question: str, answer: str) -> dict:
    low = answer.lower()
    scores = {
        "situation": 90 if any(w in low for w in ["when", "during", "project", "team", "class", "internship"]) else 55,
        "task": 90 if any(w in low for w in ["responsible", "needed", "goal", "task", "challenge", "problem"]) else 55,
        "action": 92 if any(w in low for w in ["i built", "i implemented", "i created", "i designed", "i solved", "i used", "i worked"]) else 60,
        "result": 92 if any(w in low for w in ["result", "improved", "reduced", "increased", "%", "users", "saved", "accuracy"]) else 50,
        "clarity": min(95, max(50, 100 - abs(len(answer.split()) - 115) // 2)),
    }
    overall = int(sum(scores.values()) / len(scores))
    return {
        "question": question,
        "scores": scores,
        "overall_score": overall,
        "feedback": [
            "Add a measurable result." if scores["result"] < 70 else "Result section is clear.",
            "Use more direct 'I did X' language." if scores["action"] < 70 else "Action section is strong.",
            "Add short context at the start." if scores["situation"] < 70 else "Situation is understandable.",
            "Keep final answer around 60-90 seconds.",
        ],
        "better_answer_template": "Situation: In [project/team], we faced [problem]. Task: I was responsible for [goal]. Action: I [specific action/tools]. Result: This improved [metric/outcome].",
    }


def analyze_communication(transcript: str, duration_seconds: float | None = None) -> dict:
    words = transcript.split()
    low = transcript.lower()
    fillers = ["um", "uh", "like", "you know", "actually", "basically", "hmm"]
    filler_count = sum(low.count(f) for f in fillers)
    duration = duration_seconds or max(30, len(words) / 2.1)
    wpm = int((len(words) / max(duration, 1)) * 60)
    clarity = max(40, min(100, 95 - filler_count * 4 - abs(wpm - 145) // 3))
    confidence = max(40, min(100, clarity + (10 if len(words) > 45 else -8)))
    return {
        "word_count": len(words),
        "estimated_wpm": wpm,
        "filler_count": filler_count,
        "clarity_score": clarity,
        "confidence_score": confidence,
        "pace_feedback": "Good pace." if 120 <= wpm <= 170 else "Slow down slightly." if wpm > 170 else "Speak a little faster with more energy.",
        "improvements": [
            "Pause instead of using filler words.",
            "Use a 3-part structure: context, action, result.",
            "End with impact or learning.",
        ],
    }


def evaluate_code(question: str, solution: str, language: str) -> dict:
    low = solution.lower()
    has_function = any(x in low for x in ["def ", "function ", "class ", "public ", "const ", "let "])
    has_loop = any(x in low for x in ["for ", "while ", ".map", ".foreach"])
    has_hash = any(x in low for x in ["dict", "map", "set", "hash", "object", "{}"])
    has_return = "return" in low
    has_tests = any(x in low for x in ["assert", "test", "console.log", "print("])
    score = min(100, 40 + (15 if has_function else 0) + (15 if has_loop else 0) + (10 if has_hash else 0) + (10 if has_return else 0) + (10 if has_tests else 0))
    return {
        "language": language,
        "correctness_estimate": score,
        "complexity": "Likely O(n)" if has_loop or has_hash else "Unclear / possibly incomplete",
        "signals": {
            "has_function": has_function,
            "has_loop": has_loop,
            "uses_hash_structure": has_hash,
            "has_return": has_return,
            "has_tests_or_prints": has_tests,
        },
        "strengths": [
            "Structured solution detected." if has_function else "Add a function signature.",
            "Iteration detected." if has_loop else "Explain traversal clearly.",
            "Hash-based optimization detected." if has_hash else "Consider map/set for faster lookup when useful.",
        ],
        "improvements": [
            "Add edge cases.",
            "State time and space complexity.",
            "Test empty, duplicate, and boundary inputs.",
        ],
        "interview_explanation_template": "Approach → Data structure choice → Complexity → Edge cases.",
    }
