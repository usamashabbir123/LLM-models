"""Web content summarization model module.

Encapsulates all logic required to:
- Fetch and clean webpage content from a URL
- Summarize arbitrary text
- Call a local LLM via Ollama (through models.ollama_basic.ask)

The backend should import and call only the functions exposed here.
"""

from __future__ import annotations

import requests
from bs4 import BeautifulSoup
from typing import Optional

from models.ollama_basic import ask


def _fetch_and_clean(url: str, *, timeout: int = 15) -> str:
    resp = requests.get(url, timeout=timeout, headers={"User-Agent": "Mozilla/5.0"})
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.extract()
    text = soup.get_text(separator=" ")
    cleaned = " ".join(text.split())
    return cleaned[:15000]


def _build_prompt(content: str) -> str:
    return (
        "Summarize the following webpage content in 5 concise bullet points. "
        "Be clear, neutral, and include any key stats or links if present.\n\n"
        f"CONTENT:\n{content}"
    )


def summarize_url(url: str, *, model: Optional[str] = None, host: Optional[str] = None) -> str:
    content = _fetch_and_clean(url)
    prompt = _build_prompt(content)
    return ask(prompt, model=model, host=host)


def summarize_text(text: str, *, model: Optional[str] = None, host: Optional[str] = None) -> str:
    prompt = _build_prompt(text)
    return ask(prompt, model=model, host=host)
