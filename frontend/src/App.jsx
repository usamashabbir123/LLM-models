import React, { useState, useRef, useEffect } from 'react'

const API_BASE = import.meta?.env?.VITE_API_BASE || 'http://localhost:8000'

export default function App() {
  const [url, setUrl] = useState('')
  const [text, setText] = useState('')
  const [provider, setProvider] = useState('ollama')
  const [model, setModel] = useState('llama3.2:latest')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [summary, setSummary] = useState('')
  const [elapsedMs, setElapsedMs] = useState(0)
  const timerRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [loading, summary, error])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSummary('')
    setElapsedMs(0)
    const started = Date.now()
    if (timerRef.current) clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setElapsedMs(Date.now() - started)
    }, 100)

    try {
      const payload = url ? { url } : { text }
      payload.provider = provider
      payload.model = model
      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || `Request failed: ${res.status}`)
      }
      const data = await res.json()
      setSummary(data.summary || '')
    } catch (err) {
      setError(err.message || 'Unexpected error')
    } finally {
      setLoading(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      // Finalize elapsed time precisely
      setElapsedMs(Date.now() - started)
    }
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xxl-8 col-lg-10">
          <div className="rounded-4 p-4 p-md-5 shadow-lg bg-white/70 backdrop-blur-md border border-white/40">
            <div className="mb-4">
              <h1 className="display-6 fw-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600">Website Summarizer</span>
              </h1>
              <p className="text-slate-600 m-0">Enter a URL or paste content. We’ll fetch, analyze with an LLM, and return a clean summary.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="row g-3 mb-2">
                <div className="col-12 col-md-6">
                  <label className="form-label">Provider</label>
                  <select className="form-select" value={provider} onChange={(e) => {
                    const next = e.target.value
                    setProvider(next)
                    if (next === 'ollama' && (model === '' || model.startsWith('gpt'))) {
                      setModel('llama3.2:latest')
                    }
                    if (next === 'openai' && (model === '' || model.includes('llama'))) {
                      setModel('gpt-4o-mini')
                    }
                  }}>
                    <option value="ollama">Ollama (local, default)</option>
                    <option value="openai">OpenAI (cloud)</option>
                  </select>
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Model</label>
                  <input
                    type="text"
                    className="form-control"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder={provider === 'openai' ? 'e.g., gpt-4o-mini' : 'e.g., llama3.2:latest'}
                  />
                  <div className="form-text">
                    {provider === 'openai' ? 'Requires OPENAI_API_KEY on server.' : 'Runs via local Ollama.'}
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Website URL</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/article"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <div className="form-text">Alternatively, leave URL empty and paste content below.</div>
              </div>

              <div className="mb-3">
                <label className="form-label">Or Paste Content</label>
                <textarea
                  className="form-control"
                  rows={6}
                  placeholder="Paste text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>

              <div className="d-grid d-sm-flex gap-3 align-items-center">
                <button type="submit" className="btn btn-primary px-4 shadow-sm" disabled={loading || (!url && !text)}>
                  {loading ? 'Summarizing…' : 'Summarize'}
                </button>
                <button type="button" className="btn btn-outline-secondary" onClick={() => { setUrl(''); setText(''); setSummary(''); setError(''); setElapsedMs(0); setProvider('ollama'); setModel('llama3.2:latest') }} disabled={loading}>
                  Clear
                </button>
                <div className="text-slate-600 ms-sm-2 mt-2 mt-sm-0">
                  {loading ? (
                    <span>Elapsed: {(elapsedMs/1000).toFixed(1)}s</span>
                  ) : (
                    elapsedMs > 0 && <span>Completed in {(elapsedMs/1000).toFixed(2)}s</span>
                  )}
                </div>
              </div>
            </form>

            <div className="mt-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="h6 text-slate-700 m-0">Result</h2>
                {!loading && elapsedMs > 0 && (
                  <span className="badge text-bg-light border">{(elapsedMs/1000).toFixed(2)}s</span>
                )}
              </div>
              <div ref={scrollRef} className="border rounded-3 p-3 bg-slate-50" style={{ minHeight: '180px', maxHeight: '360px', overflowY: 'auto' }}>
                {loading && (
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-3">
                      <div className="spinner-border text-primary" role="status" />
                      <div className="text-slate-600">Processing your request…</div>
                    </div>
                    <div className="text-slate-500 small">{(elapsedMs/1000).toFixed(1)}s</div>
                  </div>
                )}
                {!loading && error && (
                  <div className="text-danger">{error}</div>
                )}
                {!loading && !error && summary && (
                  <pre className="m-0 whitespace-pre-wrap">{summary}</pre>
                )}
                {!loading && !error && !summary && (
                  <div className="text-slate-500">Your summary will appear here.</div>
                )}
              </div>
            </div>

            <div className="mt-4 d-flex flex-wrap gap-2">
              <span className="badge rounded-pill text-bg-primary/10 text-primary border border-primary/20">Fast</span>
              <span className="badge rounded-pill text-bg-info/10 text-info border border-info/20">Clean Output</span>
              <span className="badge rounded-pill text-bg-success/10 text-success border border-success/20">LLM Powered</span>
            </div>

            <div className="mt-4 text-slate-500 text-sm">
              Backend at <code>http://localhost:8000</code>. Override with <code>VITE_API_BASE</code>.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
