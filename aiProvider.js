/* ============================================================
   AI PROVIDER ADAPTER
   Normalizes calls to a configured, OpenAI-compatible chat-
   completions API so the rest of PRACTICE never touches a raw
   request/response shape. Swapping providers/models later only
   means changing config — not rewriting the UI.

   NOTE ON KEY SECURITY:
   This is currently a client-side-only app (no build/server step
   shipped with the project), so requests are sent directly from
   the browser using the key the learner enters. That key lives
   only in this browser's localStorage and is sent only to the
   base URL the learner configures — never anywhere else. The UI
   makes this explicit. The adapter below is intentionally the
   ONLY place that talks to the network, so migrating to a real
   backend proxy later means changing this one file, not the
   conversation UI.
   ============================================================ */

const AIProvider = (function () {

  function normalizeBaseUrl(url) {
    return (url || '').trim().replace(/\/+$/, '');
  }

  function readableError(status, bodyText) {
    let parsed = null;
    try { parsed = JSON.parse(bodyText); } catch (e) {}
    const serverMsg = parsed && parsed.error && (parsed.error.message || parsed.error)
      ? (typeof parsed.error === 'string' ? parsed.error : parsed.error.message)
      : null;

    if (status === 401 || status === 403) {
      return 'Authentication failed. Check that your API key is correct and has access to this model.';
    }
    if (status === 404) {
      return 'Endpoint or model not found. Check your API Base URL and Model name.';
    }
    if (status === 429) {
      return 'Rate limit reached. Wait a moment and try again, or check your provider quota.';
    }
    if (status >= 500) {
      return 'The AI provider had a server error. Try again shortly.';
    }
    if (status === 400) {
      return serverMsg ? ('Request rejected: ' + serverMsg) : 'The request was rejected — check your model name and settings.';
    }
    return serverMsg ? serverMsg : ('Unexpected error (status ' + status + ').');
  }

  async function callChat(config, messages, opts) {
    opts = opts || {};
    const baseUrl = normalizeBaseUrl(config.baseUrl);
    if (!baseUrl) return { ok: false, error: 'No API Base URL configured.' };
    if (!config.model) return { ok: false, error: 'No model configured.' };

    const url = baseUrl.endsWith('/chat/completions') ? baseUrl : (baseUrl + '/chat/completions');

    const payload = {
      model: config.model,
      messages: messages,
      temperature: typeof config.temperature === 'number' ? config.temperature : 0.8,
      max_tokens: typeof config.maxTokens === 'number' ? config.maxTokens : 400
    };

    let response;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), opts.timeoutMs || 30000);
      response = await fetch(url, {
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/json; charset=utf-8' },
          config.apiKey ? { 'Authorization': 'Bearer ' + config.apiKey } : {}
        ),
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (err) {
      if (err && err.name === 'AbortError') {
        return { ok: false, error: 'The request timed out. Check your network connection or API Base URL.' };
      }
      return { ok: false, error: 'Network error — could not reach the API. Check your API Base URL and internet connection.' };
    }

    const bodyText = await response.text();

    if (!response.ok) {
      return { ok: false, error: readableError(response.status, bodyText), status: response.status };
    }

    let data;
    try {
      data = JSON.parse(bodyText);
    } catch (e) {
      return { ok: false, error: 'The server returned a response in an unexpected format.' };
    }

    const text =
      (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) ||
      (data.choices && data.choices[0] && data.choices[0].text) ||
      null;

    if (text == null) {
      return { ok: false, error: 'Unsupported response format — no message content found in the reply.' };
    }

    return {
      ok: true,
      text: String(text).trim(),
      model: data.model || config.model,
      raw: data
    };
  }

  async function testConnection(config) {
    const start = performance.now();
    const result = await callChat(config, [
      { role: 'system', content: 'Reply with the single word: OK' },
      { role: 'user', content: 'ping' }
    ], { timeoutMs: 15000 });
    const elapsedMs = Math.round(performance.now() - start);

    if (!result.ok) {
      return { ok: false, error: result.error };
    }
    return {
      ok: true,
      model: result.model,
      elapsedMs: elapsedMs
    };
  }

  return { callChat, testConnection };
})();
