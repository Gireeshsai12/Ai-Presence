import json
from typing import Any

def dumps(data: Any) -> str:
    try:
        return json.dumps(data, ensure_ascii=False)
    except Exception:
        return "{}"

def loads(raw: str, fallback: Any = None) -> Any:
    try:
        return json.loads(raw or "")
    except Exception:
        return fallback if fallback is not None else {}
