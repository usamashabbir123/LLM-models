# Website Summarizer — Clean Separation

This project is split into three layers with clear separation of concerns:

- Frontend (React + Vite + Bootstrap/Tailwind for styling)
- Backend (Flask routes/controllers, MVC)
- Model layer (pure model logic: fetch/clean, prompt, and call LLM)

## Structure
```
backend/                 # Flask API
  ├─ app.py              # App factory, registers blueprints
  ├─ requirements.txt    # Flask, CORS, requests, bs4, ollama, openai
  ├─ routes/
  │  └─ api.py          # Blueprint with /api routes
  └─ controllers/
     └─ summarize_controller.py  # Validates request, calls models layer
frontend/                # React UI
models/                  # Model layer (no framework/route logic)
  ├─ ollama_basic.py     # Thin Ollama client wrapper (ask)
  ├─ openai_basic.py     # Thin OpenAI client wrapper (ask)
  └─ web_summarizer.py   # URL/text summarization; dispatches to provider
```

## Flow
1) Frontend posts `{ url }` or `{ text }` to `POST /api/summarize`.
2) Backend view imports and calls `models.web_summarizer.summarize_url` or `summarize_text`.
3) Model fetches/cleans content (for URL), builds prompt, calls local LLM via Ollama, returns summary.

## Run Backend (Flask)
- `cd backend`
- Create venv and install: `python -m venv .venv && .venv\\Scripts\\Activate.ps1` (Windows) or `python -m venv .venv && source .venv/bin/activate`
- `pip install -r requirements.txt`
- `python app.py` (runs on `http://localhost:8000`)

## Run Frontend
- `cd frontend`
- `npm install`
- `npm run dev`
- Open `http://localhost:5173`

## Ollama
- Ensure the daemon is running and a model is pulled, e.g. `ollama pull llama3.1:8b`
- Optional env vars: `OLLAMA_HOST`, `OLLAMA_MODEL`

## OpenAI (optional)
- Set `OPENAI_API_KEY` in the backend environment to enable OpenAI provider.
- Default OpenAI model used is `gpt-4o-mini` (override via UI or `OPENAI_MODEL`).

## Notes
- The backend’s `views.py` intentionally contains no scraping/LLM logic—only request handling and model invocation.
- The model layer may use `requests`, `beautifulsoup4`, and `ollama`. These packages are listed in `backend/requirements.txt` for convenience in a single environment.
