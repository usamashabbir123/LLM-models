import os

try:
    from ollama import Client
except ImportError:
    raise SystemExit("Missing dependency: install with 'pip install -r backend/requirements.txt'")


def ask(prompt: str, model: str | None = None, host: str | None = None) -> str:
    """Send a simple prompt to an Ollama model and return the text reply."""
    host = host or os.getenv("OLLAMA_HOST", "http://127.0.0.1:11434")
    model = model or os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    client = Client(host=host)
    res = client.generate(model=model, prompt=prompt, stream=False)
    return res.get("response", "")

