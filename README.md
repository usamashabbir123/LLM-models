# Simple LLM Models (Python + Ollama)

A super-simple starting point to use local LLMs via Ollama.

## What you get
- One minimal function in `models/ollama_basic.py` to send a prompt and get text back.
- A tiny demo when you run the file directly.

## Prerequisites
- Python 3.9+
- Ollama installed and running locally (default: `http://127.0.0.1:11434`)
- A pulled model (example): `ollama pull llama3.1:8b`

## Setup
1. (Recommended) Create and activate a virtual environment
   - Windows (PowerShell):
     - `python -m venv .venv`
     - `.venv\\Scripts\\Activate.ps1`
   - macOS/Linux:
     - `python -m venv .venv`
     - `source .venv/bin/activate`
2. Install dependency: `pip install -r requirements.txt`

## Quickstart
- Run the simple demo:
  - `python models/ollama_basic.py`

- Use it in your code:
  ```python
  from models.ollama_basic import ask

  print(ask("Give two tips for learning Python."))
  ```

## Configuration (optional)
- `OLLAMA_HOST` sets the server URL (default `http://127.0.0.1:11434`).
- `OLLAMA_MODEL` sets the model (default `llama3.1:8b`).

