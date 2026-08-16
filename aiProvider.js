/* ============================================================
   AI PROVIDER ADAPTER
   Normalizes calls to a configured, OpenAI-compatible chat-
   completions API so the rest of PRACTICE never touches a raw
   request/response shape. Swapping providers/models later only
   means changing config — not rewriting the UI.

   FREE ONLY: this file is the single place that knows which
   providers/models are free and the only place that talks to
   the network. See FREE_PROVIDERS below for the catalog.

   NOTE ON KEY SECURITY:
   This is currently a client-side-only app (no build/server step
   shipped with the project), so requests are sent directly from
   the browser using the key the learner enters. That key lives
   only in this browser's localStorage and is sent only to the
   base URL of the selected provider — never anywhere else. The
   UI makes this explicit. Migrating to a real backend proxy
   later means changing this one file, not the conversation UI.
   ============================================================ */

const AIProvider = (function () {

  /* ------------------------------------------------------------
     FREE PROVIDER CATALOG
     Each entry describes ONLY the free-tier surface of a provider.
     No paid-only models are listed here, and base URLs are fixed
     per provider so the learner never has to type or edit them.

     Checked against each provider's official docs: Aug 2026.
     Free-tier availability changes over time — if a provider
     changes its plan, update `models` here rather than guessing.
     ------------------------------------------------------------ */
  const FREE_PROVIDERS = {
    groq: {
      id: 'groq',
      name: 'Groq',
      tier: 'free',
      badge: 'Free Tier',
      baseUrl: 'https://api.groq.com/openai/v1',
      requiresBilling: false,
      infoUrl: 'https://console.groq.com/docs/models',
      note: 'No credit card required. Every model on Groq runs on its free, rate-limited developer tier — there is no separate paid model catalog to accidentally select.',
      models: [
        { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B (fast, general)' },
        { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B (higher quality)' },
        { id: 'meta-llama/llama-4-scout-17b-16e-instruct', label: 'Llama 4 Scout' },
        { id: 'qwen/qwen3-32b', label: 'Qwen3 32B' }
      ]
    },
    gemini: {
      id: 'gemini',
      name: 'Google Gemini',
      tier: 'free',
      badge: 'Free Tier',
      // Gemini's OpenAI-compatibility layer, so it can reuse the same
      // /chat/completions request shape as Groq.
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
      requiresBilling: false,
      infoUrl: 'https://ai.google.dev/pricing',
      note: 'Free via Google AI Studio, no billing required. Only Flash / Flash-Lite models are listed — Gemini Pro models require a billing-enabled project, so they are intentionally left out.',
      models: [
        { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
        { id: 'gemini-2.5-flash-lite', label: 'Gemini 2.5 Flash-Lite' },
        { id: 'gemini-3-flash', label: 'Gemini 3 Flash' },
        { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite' }
      ]
    }
  };

  // Known billing-required model name patterns. Defense in depth: even
  // if one of these ever ended up in a models[] list above by mistake,
  // callChat() still refuses to send a request for it.
  const KNOWN_PAID_ONLY_MODELS = [
    /^gemini-3(\.\d+)?-pro/i,
    /^gemini-2\.5-pro/i
  ];

  function isKnownPaidOnly(modelId) {
    return KNOWN_PAID_ONLY_MODELS.some(re => re.test(String(modelId || '')));
  }

  function getFreeProviders() {
    // Return a copy so callers can't mutate the catalog.
    return Object.keys(FREE_PROVIDERS).map(id => {
      const p = FREE_PROVIDERS[id];
      return Object.assign({}, p, { models: p.models.slice() });
    });
  }

  function getProvider(id) {
    return FREE_PROVIDERS[id] || null;
  }

  // 'openai-compatible' is the old provider id from before the Free
  // Providers system existed. Treat it as an alias for 'custom' so
  // configs saved by earlier versions of this page keep working.
  function normalizeProviderId(id) {
    return id === 'openai-compatible' ? 'custom' : id;
  }

  function resolveBaseUrl(config) {
    const providerId = normalizeProviderId(config.provider);
    if (!providerId || providerId === 'custom') return config.baseUrl;
    const p = FREE_PROVIDERS[providerId];
    return p ? p.baseUrl : config.baseUrl;
  }

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
      return 'Endpoint or model not found. Check your provider and model selection.';
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

    if (!config.model) return { ok: false, error: 'No model configured.' };

    // FREE-ONLY GUARD: for a recognized free provider, only the models
    // listed in its free catalog may be used. This is what stops a
    // stale, tampered, or hand-edited config from silently reaching a
    // paid model. Custom providers are explicitly unverified and are
    // only reachable through the Advanced option.
    const providerId = normalizeProviderId(config.provider);
    if (providerId && providerId !== 'custom') {
      const provider = getProvider(providerId);
      if (!provider) {
        return { ok: false, error: 'Unknown AI provider.' };
      }
      const known = provider.models.some(m => m.id === config.model);
      if (!known || isKnownPaidOnly(config.model)) {
        return { ok: false, error: 'This model is not available through the configured free tier.' };
      }
    } else if (isKnownPaidOnly(config.model)) {
      return { ok: false, error: 'This model is not available through the configured free tier.' };
    }

    const baseUrl = normalizeBaseUrl(resolveBaseUrl(config));
    if (!baseUrl) return { ok: false, error: 'No API Base URL configured.' };

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
        return { ok: false, error: 'The request timed out. Check your network connection or provider selection.' };
      }
      return { ok: false, error: 'Network error — could not reach the API. Check your internet connection.' };
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
      elapsedMs: elapsedMs,
      provider: config.provider,
      freeTier: !!(config.provider && config.provider !== 'custom')
    };
  }

  return {
    callChat,
    testConnection,
    getFreeProviders,
    getProvider,
    resolveBaseUrl,
    isKnownPaidOnly
  };
})();
