import json
from django.http import JsonResponse, HttpRequest
from django.views.decorators.csrf import csrf_exempt
from typing import Optional

from models.web_summarizer import summarize_url, summarize_text


@csrf_exempt
def summarize(request: HttpRequest):
    if request.method != "POST":
        return JsonResponse({"error": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8")) if request.body else {}
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    url = data.get("url")
    raw_text = data.get("text")
    if not url and not raw_text:
        return JsonResponse({"error": "Provide 'url' or 'text'"}, status=400)

    try:
        if url:
            summary = summarize_url(url)
        else:
            summary = summarize_text(raw_text)
        return JsonResponse({"summary": summary})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
