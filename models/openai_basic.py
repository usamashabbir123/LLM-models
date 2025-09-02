import os

try:
    from openai import OpenAI
except Exception as exc:  # pragma: no cover
    OpenAI = None  # type: ignore


def ask(prompt: str, model: str | None = None, host: str | None = None) -> str:
    """Send a prompt to OpenAI and return the text reply.

    Requires OPENAI_API_KEY to be set in the environment.
    """
    if OpenAI is None:
        raise RuntimeError("Missing 'openai' package. Install backend/requirements.txt.")

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise RuntimeError("OPENAI_API_KEY not set in environment.")

    client = OpenAI(api_key=api_key)
    used_model = model or os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    resp = client.chat.completions.create(
        model=used_model,
        messages=[
            {"role": "system", "content": "You are a concise and helpful assistant."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.2,
        max_tokens=512,
    )
    msg = resp.choices[0].message.content or ""
    return msg.strip()

