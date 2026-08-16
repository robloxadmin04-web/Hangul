/* ============================================================
   PRACTICE APP
   Orchestrates the PRACTICE UI. Delegates AI calls to
   ConversationService/AIProvider, storage to PracticeStorage,
   speech to PracticeTTS, romanization to HangulUtils, and PDF
   export to PracticePDFExport. Kept UI-only on purpose.
   ============================================================ */

(function () {
  const PREFS_KEY = 'koreanPractice_prefs';

  function getPrefs() {
    try {
      return Object.assign({
        romanization: false,
        autoTranslate: false,
        audioEnabled: true,
        autoplay: false,
        hintBehavior: 'progressive',
        responseLength: 'medium',
        koreanOnly: true,
        autoCorrect: true
      }, JSON.parse(localStorage.getItem(PREFS_KEY) || '{}'));
    } catch (e) {
      return { romanization: false, autoTranslate: false, audioEnabled: true, autoplay: false, hintBehavior: 'progressive', responseLength: 'medium', koreanOnly: true, autoCorrect: true };
    }
  }
  function setPrefs(p) { try { localStorage.setItem(PREFS_KEY, JSON.stringify(p)); } catch (e) {} }

  const state = {
    prefs: getPrefs(),
    aiConfig: PracticeStorage.getAIConfig(),
    category: null,
    difficulty: 'intermediate',
    roleplayScenario: '',
    history: [],            // sent to the AI: {role:'user'|'assistant', text, kr, ...}
    displayMessages: [],     // rendered messages, richer shape
    hintsUsed: 0,
    translationsUsed: 0,
    sessionStart: null,
    pendingCorrections: [],
    pendingVocab: [],
    hintLevel: 0,
    lastReportSession: null
  };

  const CATEGORY_META = [
    { id: 'formal', kr: '존댓말', en: 'Formal' },
    { id: 'casual', kr: '반말', en: 'Casual' },
    { id: 'daily', kr: '일상 대화', en: 'Daily Life' },
    { id: 'friends', kr: '친구와 대화', en: 'Friends' },
    { id: 'business', kr: '비즈니스', en: 'Professional' },
    { id: 'texting', kr: '문자/채팅', en: 'Texting' },
    { id: 'situational', kr: '상황별 대화', en: 'Situational' },
    { id: 'slang', kr: '속어/신조어', en: 'Slang' },
    { id: 'romantic', kr: '연애 대화', en: 'Romantic' },
    { id: 'roleplay', kr: '역할극', en: 'Roleplay' }
  ];
  const DIFFICULTIES = ['beginner', 'elementary', 'intermediate', 'advanced', 'native'];

  const $ = (id) => document.getElementById(id);

  /* ================= INIT ================= */
  function init() {
    renderCategoryGrid();
    renderDifficultyRow();
    loadAIConfigIntoForm();
    loadPrefsIntoForm();
    updateStatusPill();
    wireSetup();
    wireDrawer();
    wireAIForm();
    wireConversationForm();
    wireLearningForm();
    wirePrivacy();
    wireComposer();
    wireReportModal();
    renderMistakeBank();
    renderHistory();
    autosizeTextarea($('prInput'));
    setupViewportKeyboardFix();
    initMic();
  }

  /* ================= SETUP SCREEN ================= */
  function renderCategoryGrid() {
    const grid = $('prCategoryGrid');
    grid.innerHTML = CATEGORY_META.map(c =>
      '<button type="button" class="pr-cat-btn" data-cat="' + c.id + '">' +
      '<span class="pr-cat-kr">' + c.kr + '</span><span class="pr-cat-en">' + c.en + '</span></button>'
    ).join('');
    grid.querySelectorAll('.pr-cat-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        grid.querySelectorAll('.pr-cat-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.category = this.dataset.cat;
        $('prRoleplayGroup').style.display = state.category === 'roleplay' ? 'block' : 'none';
      });
    });
  }

  function renderDifficultyRow() {
    const row = $('prDifficultyRow');
    row.innerHTML = DIFFICULTIES.map(d =>
      '<button type="button" class="pr-diff-btn' + (d === state.difficulty ? ' active' : '') + '" data-diff="' + d + '">' +
      d.charAt(0).toUpperCase() + d.slice(1) + '</button>'
    ).join('');
    row.querySelectorAll('.pr-diff-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        row.querySelectorAll('.pr-diff-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        state.difficulty = this.dataset.diff;
      });
    });
  }

  function wireSetup() {
    $('prStartBtn').addEventListener('click', startSession);
  }

  function startSession() {
    if (!state.category) { showSetupHint('Choose a conversation category first.'); return; }
    const cfg = state.aiConfig;
    const hasEndpoint = (cfg.provider && cfg.provider !== 'custom') || !!cfg.baseUrl;
    if (!hasEndpoint || !cfg.model || !cfg.apiKey) {
      showSetupHint('Configure your AI provider in Settings (⚙) before starting.');
      openDrawer('ai');
      return;
    }
    state.roleplayScenario = $('prRoleplayInput').value.trim();
    state.history = [];
    state.displayMessages = [];
    state.hintsUsed = 0;
    state.translationsUsed = 0;
    state.sessionStart = Date.now();

    $('prSetup').style.display = 'none';
    $('prConvo').style.display = 'flex';
    $('prConvoCat').textContent = (CATEGORY_META.find(c => c.id === state.category) || {}).en || state.category;
    $('prConvoDiff').textContent = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
    $('prMessages').innerHTML = '';

    requestAIOpeningLine();
  }

  function showSetupHint(msg) { $('prSetupHint').textContent = msg; }

  /* ================= SETTINGS OBJECT ================= */
  function currentSettings() {
    const mem = PracticeStorage.getMemory();
    return {
      category: state.category,
      difficulty: state.difficulty,
      roleplayScenario: state.roleplayScenario,
      koreanOnlyMode: state.prefs.koreanOnly,
      systemInstructions: state.aiConfig.systemInstructions,
      memorySummary: ConversationService.buildMemorySummary(mem)
    };
  }

  /* ================= CONVERSATION FLOW ================= */
  async function requestAIOpeningLine() {
    setThinking(true);
    const settings = currentSettings();
    const kickoff = state.history.concat([{ role: 'user', text: '[SYSTEM] Start the conversation naturally with a greeting appropriate to this category and difficulty.' }]);
    const result = await ConversationService.sendTurn(state.aiConfig, settings, kickoff);
    setThinking(false);
    if (!result.ok) { renderSystemError(result.error); return; }
    pushAIMessage(result.data);
  }

  async function sendUserMessage(text) {
    text = text.trim();
    if (!text) return;
    const msg = { role: 'user', text: text, romanization: HangulUtils.romanize(text), timestamp: Date.now() };
    state.history.push({ role: 'user', text: text });
    state.displayMessages.push(msg);
    renderMessage(msg);
    $('prInput').value = '';
    autosizeTextarea($('prInput'));
    scrollToBottom();

    setThinking(true);
    const settings = currentSettings();
    const result = await ConversationService.sendTurn(state.aiConfig, settings, state.history);
    setThinking(false);

    if (!result.ok) { renderSystemError(result.error); return; }
    pushAIMessage(result.data);
  }

  function pushAIMessage(data) {
    state.history.push({ role: 'assistant', kr: data.reply });
    const msg = {
      role: 'ai', text: data.reply, romanization: data.romanization, translation: data.translation,
      corrections: data.corrections || [], newVocab: data.newVocab || [], timestamp: Date.now(), translationShown: state.prefs.autoTranslate
    };
    state.displayMessages.push(msg);

    (data.corrections || []).forEach(c => {
      PracticeStorage.addOrUpdateMistake(c);
      state.pendingCorrections.push(c);
    });
    (data.newVocab || []).forEach(v => { state.pendingVocab.push(v); });

    renderMessage(msg);
    if (state.prefs.audioEnabled && state.prefs.autoplay) PracticeTTS.speak(data.reply);
    scrollToBottom();
  }

  function renderSystemError(errText) {
    const wrap = document.createElement('div');
    wrap.className = 'pr-msg from-ai';
    wrap.innerHTML = '<div class="pr-bubble" style="font-family:var(--ui-font);color:var(--error);border-color:var(--error)">⚠ ' + escapeHtml(errText) + '</div>';
    $('prMessages').appendChild(wrap);
    scrollToBottom();
  }

  function setThinking(on) { $('prThinking').style.display = on ? 'flex' : 'none'; if (on) scrollToBottom(); }
  function scrollToBottom() { const m = $('prMessages'); m.scrollTop = m.scrollHeight; }

  /* ================= MESSAGE RENDERING ================= */
  function escapeHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function renderMessage(msg) {
    const wrap = document.createElement('div');
    wrap.className = 'pr-msg ' + (msg.role === 'user' ? 'from-user' : 'from-ai');

    const rom = state.prefs.romanization && msg.romanization
      ? '<div class="pr-msg-rom">' + escapeHtml(msg.romanization) + '</div>' : '';
    const enId = 'en_' + Date.now() + '_' + Math.floor(Math.random() * 9999);
    const en = msg.role === 'ai' && msg.translation
      ? '<div class="pr-msg-en" id="' + enId + '" style="display:' + (msg.translationShown ? 'block' : 'none') + '">' + escapeHtml(msg.translation) + '</div>' : '';

    let actions = '';
    if (msg.role === 'ai') {
      actions = '<div class="pr-msg-actions">' +
        '<button class="pr-action-btn pr-act-listen" type="button">🔊 Listen</button>' +
        '<button class="pr-action-btn pr-act-slow" type="button">🐢 Slow</button>' +
        '<button class="pr-action-btn pr-act-translate" type="button">' + (msg.translationShown ? 'Hide' : 'Translate') + '</button>' +
        '</div>';
    }

    wrap.innerHTML = '<div class="pr-bubble">' + escapeHtml(msg.text) + '</div>' + rom + en + actions;
    $('prMessages').appendChild(wrap);

    if (msg.role === 'ai') {
      wrap.querySelector('.pr-act-listen').addEventListener('click', () => PracticeTTS.speak(msg.text));
      wrap.querySelector('.pr-act-slow').addEventListener('click', () => PracticeTTS.speak(msg.text, { slow: true }));
      wrap.querySelector('.pr-act-translate').addEventListener('click', function () {
        const el = document.getElementById(enId);
        if (!el) return;
        const showing = el.style.display !== 'none';
        el.style.display = showing ? 'none' : 'block';
        this.textContent = showing ? 'Translate' : 'Hide';
        if (!showing) { state.translationsUsed++; msg.translationShown = true; } else { msg.translationShown = false; }
      });

      if (state.prefs.autoCorrect && msg.corrections && msg.corrections.length) {
        msg.corrections.forEach(c => renderCorrectionCard(c));
      }
    }
  }

  function renderCorrectionCard(c) {
    const wrap = document.createElement('div');
    wrap.className = 'pr-msg from-user';
    wrap.innerHTML = '<div class="pr-correction-card">' +
      '<div class="pr-corr-cat">' + escapeHtml(c.category || 'Note') + '</div>' +
      '<div class="pr-corr-orig">' + escapeHtml(c.original) + '</div>' +
      '<div class="pr-corr-fixed">' + escapeHtml(c.corrected) + '</div>' +
      (c.explanation ? '<div class="pr-corr-exp">' + escapeHtml(c.explanation) + '</div>' : '') +
      '</div>';
    $('prMessages').appendChild(wrap);
  }

  /* ================= COMPOSER ================= */
  function wireComposer() {
    const input = $('prInput');
    const send = $('prSendBtn');
    send.addEventListener('click', () => sendUserMessage(input.value));
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendUserMessage(input.value); }
    });
    input.addEventListener('input', () => autosizeTextarea(input));

    $('prHintBtn').addEventListener('click', requestHint);
    $('prEndBtn').addEventListener('click', endSession);

    wireHangulKeyboard(input);
  }

  function wireHangulKeyboard(input) {
    const toggleBtn = $('prKbdToggleBtn');
    const panel = $('prHangulKbd');
    const kbd = HangulKeyboard.attach({
      input: input,
      container: panel,
      onToggle: function (isOpen) {
        toggleBtn.classList.toggle('active', isOpen);
        toggleBtn.setAttribute('aria-pressed', isOpen ? 'true' : 'false');
        autosizeTextarea(input);
      }
    });
    toggleBtn.addEventListener('click', function () {
      kbd.toggle();
      if (kbd.isVisible()) input.focus();
    });
  }

  function autosizeTextarea(ta) {
    ta.style.height = 'auto';
    ta.style.height = Math.min(120, ta.scrollHeight) + 'px';
  }

  async function requestHint() {
    if (!state.history.length) return;
    const settings = currentSettings();
    if (state.prefs.hintBehavior === 'direct') {
      setThinking(true);
      const res = await ConversationService.getFullAnswer(state.aiConfig, settings, state.history);
      setThinking(false);
      if (!res.ok) { renderSystemError(res.error); return; }
      state.hintsUsed++;
      renderHintCard('Suggested reply', res.answer + (res.romanization ? '\n' + res.romanization : ''));
      return;
    }
    state.hintLevel = state.hintLevel >= 3 ? 1 : state.hintLevel + 1;
    setThinking(true);
    const res = await ConversationService.getHint(state.aiConfig, settings, state.history, state.hintLevel);
    setThinking(false);
    if (!res.ok) { renderSystemError(res.error); return; }
    state.hintsUsed++;
    renderHintCard('Hint ' + state.hintLevel + ' of 3', res.hint);
  }

  function renderHintCard(label, text) {
    const wrap = document.createElement('div');
    wrap.className = 'pr-hint-card';
    wrap.innerHTML = '<div class="pr-hint-label">' + escapeHtml(label) + '</div><div style="font-family:var(--kr-font)">' + escapeHtml(text) + '</div>';
    $('prMessages').appendChild(wrap);
    scrollToBottom();
  }

  /* ================= MIC (optional) ================= */
  function initMic() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const btn = $('prMicBtn');
    btn.style.display = 'inline-flex';
    let recognizing = false;
    let recognizer = null;
    btn.addEventListener('click', function () {
      if (recognizing) { recognizer && recognizer.stop(); return; }
      recognizer = new SR();
      recognizer.lang = 'ko-KR';
      recognizer.interimResults = false;
      recognizer.onstart = () => { recognizing = true; btn.classList.add('active'); };
      recognizer.onend = () => { recognizing = false; btn.classList.remove('active'); };
      recognizer.onerror = () => { recognizing = false; btn.classList.remove('active'); };
      recognizer.onresult = (e) => {
        const text = e.results[0][0].transcript;
        $('prInput').value = ($('prInput').value + ' ' + text).trim();
        autosizeTextarea($('prInput'));
      };
      recognizer.start();
    });
  }

  /* ================= MOBILE KEYBOARD FIX ================= */
  function setupViewportKeyboardFix() {
    if (!window.visualViewport) return;
    const vv = window.visualViewport;
    function apply() {
      document.documentElement.style.setProperty('--pr-vvh', vv.height + 'px');
      document.body.style.height = vv.height + 'px';
      scrollToBottom();
    }
    vv.addEventListener('resize', apply);
    apply();
  }

  /* ================= DRAWER ================= */
  function wireDrawer() {
    $('prSettingsBtn').addEventListener('click', () => openDrawer('ai'));
    $('prHistoryBtn').addEventListener('click', () => openDrawer('mistakes'));
    $('prDrawerClose').addEventListener('click', closeDrawer);
    $('prDrawerBackdrop').addEventListener('click', closeDrawer);
    $('prDrawerTabs').querySelectorAll('.pr-drawer-tab').forEach(tab => {
      tab.addEventListener('click', function () { switchDrawerTab(this.dataset.tab); });
    });
  }
  function openDrawer(tab) {
    switchDrawerTab(tab);
    $('prDrawer').classList.add('open');
    $('prDrawerBackdrop').classList.add('open');
  }
  function closeDrawer() {
    $('prDrawer').classList.remove('open');
    $('prDrawerBackdrop').classList.remove('open');
  }
  function switchDrawerTab(tab) {
    document.querySelectorAll('.pr-drawer-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.querySelectorAll('.pr-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
    if (tab === 'mistakes') renderMistakeBank();
    if (tab === 'history') renderHistory();
  }

  /* ================= AI SETTINGS FORM ================= */
  const FREE_PROVIDERS = AIProvider.getFreeProviders();

  function populateProviderSelect() {
    const sel = $('prProvider');
    sel.innerHTML = '';
    FREE_PROVIDERS.forEach(function (p) {
      const opt = document.createElement('option');
      opt.value = p.id;
      opt.textContent = p.name + ' — ' + p.badge;
      sel.appendChild(opt);
    });
  }

  function populateModelSelect(providerId) {
    const modelSel = $('prModel');
    modelSel.innerHTML = '';
    const provider = AIProvider.getProvider(providerId);
    if (!provider) return;
    provider.models.forEach(function (m) {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = m.label;
      modelSel.appendChild(opt);
    });
  }

  function isUsingCustomProvider() {
    return $('prUseCustomProvider').checked;
  }

  function toggleCustomProviderFields() {
    const useCustom = isUsingCustomProvider();
    document.querySelectorAll('.pr-custom-only').forEach(el => { el.hidden = !useCustom; });
    $('prProvider').closest('.pr-section').style.opacity = useCustom ? '0.5' : '';
    $('prProvider').disabled = useCustom;
    $('prModel').disabled = useCustom;
    renderProviderStatus();
  }

  function renderProviderStatus() {
    const box = $('prProviderStatus');
    if (isUsingCustomProvider()) {
      box.innerHTML = '<span class="pr-badge pr-badge-warn">Custom Provider — not verified as free</span>';
      return;
    }
    const provider = AIProvider.getProvider($('prProvider').value);
    if (!provider) { box.innerHTML = ''; return; }
    box.innerHTML =
      '<span class="pr-badge pr-badge-free">' + provider.badge + '</span>' +
      '<p class="pr-provider-note">' + provider.note + '</p>' +
      '<p class="pr-panel-note">Free access may have rate limits or daily usage limits depending on the provider.</p>';
  }

  function loadAIConfigIntoForm() {
    const c = state.aiConfig;
    const useCustom = !c.provider || c.provider === 'custom' || c.provider === 'openai-compatible';

    populateProviderSelect();
    $('prUseCustomProvider').checked = useCustom;

    if (!useCustom) {
      $('prProvider').value = c.provider;
      populateModelSelect(c.provider);
      if (c.model) $('prModel').value = c.model;
    } else {
      // Keep a sensible free provider preselected underneath so the
      // learner can uncheck "custom" and land on a real free option.
      $('prProvider').value = FREE_PROVIDERS[0] ? FREE_PROVIDERS[0].id : '';
      populateModelSelect($('prProvider').value);
    }

    $('prBaseUrl').value = c.baseUrl || '';
    $('prCustomModel').value = useCustom ? (c.model || '') : '';
    $('prApiKey').value = c.apiKey || '';
    $('prTemperature').value = c.temperature != null ? c.temperature : 0.8;
    $('prTempVal').textContent = $('prTemperature').value;
    $('prMaxTokens').value = c.maxTokens || 400;
    $('prSystemInstructions').value = c.systemInstructions || '';

    toggleCustomProviderFields();
  }

  function readAIConfigFromForm() {
    const useCustom = isUsingCustomProvider();
    if (useCustom) {
      return {
        provider: 'custom',
        baseUrl: $('prBaseUrl').value.trim(),
        apiKey: $('prApiKey').value,
        model: $('prCustomModel').value.trim(),
        temperature: parseFloat($('prTemperature').value),
        maxTokens: parseInt($('prMaxTokens').value, 10) || 400,
        systemInstructions: $('prSystemInstructions').value.trim()
      };
    }
    return {
      provider: $('prProvider').value,
      baseUrl: '', // resolved from the provider catalog, never hand-entered
      apiKey: $('prApiKey').value,
      model: $('prModel').value,
      temperature: parseFloat($('prTemperature').value),
      maxTokens: parseInt($('prMaxTokens').value, 10) || 400,
      systemInstructions: $('prSystemInstructions').value.trim()
    };
  }

  function wireAIForm() {
    $('prTemperature').addEventListener('input', function () { $('prTempVal').textContent = this.value; });
    $('prProvider').addEventListener('change', function () {
      populateModelSelect(this.value);
      renderProviderStatus();
    });
    $('prUseCustomProvider').addEventListener('change', toggleCustomProviderFields);

    $('prSaveAIBtn').addEventListener('click', function () {
      state.aiConfig = readAIConfigFromForm();
      PracticeStorage.setAIConfig(state.aiConfig);
      updateStatusPill();
      const r = $('prTestResult');
      r.className = 'pr-test-result ok'; r.textContent = 'Saved.'; r.style.display = 'block';
      setTimeout(() => { r.className = 'pr-test-result'; r.style.display = 'none'; }, 1800);
    });
    $('prTestBtn').addEventListener('click', async function () {
      const cfg = readAIConfigFromForm();
      const r = $('prTestResult');
      r.className = 'pr-test-result'; r.textContent = 'Testing…'; r.style.display = 'block';

      if (!cfg.apiKey) {
        r.className = 'pr-test-result err'; r.textContent = 'Invalid API key.';
        setConnectionStatus('error');
        return;
      }
      if (!cfg.model) {
        r.className = 'pr-test-result err'; r.textContent = 'Model unavailable.';
        setConnectionStatus('error');
        return;
      }

      const result = await AIProvider.testConnection(cfg);
      if (result.ok) {
        r.className = 'pr-test-result ok';
        const providerName = cfg.provider === 'custom' ? 'Custom Provider' : (AIProvider.getProvider(cfg.provider) || {}).name || cfg.provider;
        r.textContent =
          'Connection successful\nProvider: ' + providerName + '\nModel: ' + result.model +
          (result.freeTier ? '\nFree tier configuration detected.' : '\nCustom provider — free tier not verified.');
        setConnectionStatus('connected');
      } else {
        r.className = 'pr-test-result err';
        r.textContent = 'Connection failed\n' + result.error;
        setConnectionStatus('error');
      }
    });
  }

  function updateStatusPill() {
    const c = state.aiConfig;
    const hasEndpoint = (c.provider && c.provider !== 'custom') || !!c.baseUrl;
    if (!hasEndpoint || !c.model || !c.apiKey) setConnectionStatus('unconfigured');
    else setConnectionStatus('configured');
  }
  function setConnectionStatus(kind) {
    const pill = $('prStatus');
    pill.classList.remove('is-connected', 'is-error');
    const text = $('prStatusText');
    if (kind === 'connected') { pill.classList.add('is-connected'); text.textContent = 'Connected'; }
    else if (kind === 'error') { pill.classList.add('is-error'); text.textContent = 'Connection error'; }
    else if (kind === 'configured') { text.textContent = 'Configured'; }
    else { text.textContent = 'Not configured'; }
  }

  /* ================= CONVERSATION / LEARNING PREFS FORMS ================= */
  function loadPrefsIntoForm() {
    const p = state.prefs;
    $('prResponseLength').value = p.responseLength;
    $('prKoreanOnly').checked = p.koreanOnly;
    $('prAutoCorrect').checked = p.autoCorrect;
    $('prRomanization').checked = p.romanization;
    $('prAutoTranslate').checked = p.autoTranslate;
    $('prAudioEnabled').checked = p.audioEnabled;
    $('prAutoplay').checked = p.autoplay;
    $('prHintBehavior').value = p.hintBehavior;
  }

  function wireConversationForm() {
    ['prResponseLength', 'prKoreanOnly', 'prAutoCorrect'].forEach(id => {
      $(id).addEventListener('change', persistPrefsFromForm);
    });
  }
  function wireLearningForm() {
    ['prRomanization', 'prAutoTranslate', 'prAudioEnabled', 'prAutoplay', 'prHintBehavior'].forEach(id => {
      $(id).addEventListener('change', persistPrefsFromForm);
    });
    $('prRomanization').addEventListener('change', reRenderConversation);
  }
  function persistPrefsFromForm() {
    state.prefs = {
      responseLength: $('prResponseLength').value,
      koreanOnly: $('prKoreanOnly').checked,
      autoCorrect: $('prAutoCorrect').checked,
      romanization: $('prRomanization').checked,
      autoTranslate: $('prAutoTranslate').checked,
      audioEnabled: $('prAudioEnabled').checked,
      autoplay: $('prAutoplay').checked,
      hintBehavior: $('prHintBehavior').value
    };
    setPrefs(state.prefs);
  }
  function reRenderConversation() {
    persistPrefsFromForm();
    $('prMessages').innerHTML = '';
    state.displayMessages.forEach(m => { if (m.role) renderMessage(m); });
    scrollToBottom();
  }

  /* ================= MISTAKE BANK ================= */
  function renderMistakeBank(filter) {
    const list = PracticeStorage.getMistakes().filter(m =>
      !filter || m.original.includes(filter) || (m.corrected || '').includes(filter) || (m.category || '').toLowerCase().includes(filter.toLowerCase())
    );
    const el = $('prMistakeList');
    if (!list.length) { el.innerHTML = '<div class="pr-empty-note">No mistakes recorded yet.</div>'; return; }
    el.innerHTML = list.map(m =>
      '<div class="pr-mistake-item" data-id="' + m.id + '">' +
      '<div class="pr-mistake-orig">' + escapeHtml(m.original) + '</div>' +
      '<div class="pr-mistake-fixed">' + escapeHtml(m.corrected) + '</div>' +
      (m.explanation ? '<div style="color:var(--text-dim)">' + escapeHtml(m.explanation) + '</div>' : '') +
      '<div class="pr-mistake-meta">' +
      '<span>' + escapeHtml(m.category) + '</span><span>' + m.occurrences + 'x</span>' +
      '<button type="button" class="pr-mistake-status-btn' + (m.status === 'mastered' ? ' mastered' : '') + '" data-id="' + m.id + '">' +
      (m.status === 'mastered' ? '✓ Mastered' : 'Needs Practice') + '</button>' +
      '</div></div>'
    ).join('');
    el.querySelectorAll('.pr-mistake-status-btn').forEach(btn => {
      btn.addEventListener('click', function () {
        const list2 = PracticeStorage.getMistakes();
        const m = list2.find(x => x.id === this.dataset.id);
        const next = m.status === 'mastered' ? 'needs-practice' : 'mastered';
        PracticeStorage.setMistakeStatus(this.dataset.id, next);
        renderMistakeBank($('prMistakeSearch').value.trim());
      });
    });
  }
  document.addEventListener('DOMContentLoaded', () => {
    const s = $('prMistakeSearch');
    if (s) s.addEventListener('input', () => renderMistakeBank(s.value.trim()));
  });

  /* ================= HISTORY ================= */
  function renderHistory() {
    const sessions = PracticeStorage.getSessions();
    const el = $('prHistoryList');
    if (!sessions.length) { el.innerHTML = '<div class="pr-empty-note">No past sessions yet.</div>'; return; }
    el.innerHTML = sessions.map(s =>
      '<div class="pr-history-item">' +
      '<div class="pr-history-cat">' + escapeHtml(s.categoryLabel) + ' · ' + escapeHtml(s.difficulty) + '</div>' +
      '<div class="pr-history-meta">' + escapeHtml(new Date(s.date).toLocaleDateString()) + ' · ' + s.durationMinutes + ' min · ' + s.messageCount + ' messages</div>' +
      '</div>'
    ).join('');
  }

  /* ================= PRIVACY ================= */
  function wirePrivacy() {
    $('prClearConvoBtn').addEventListener('click', () => {
      if (!confirm('Clear the current conversation?')) return;
      state.history = []; state.displayMessages = [];
      $('prMessages').innerHTML = '';
    });
    $('prClearHistoryBtn').addEventListener('click', () => {
      if (!confirm('Clear all saved practice history?')) return;
      PracticeStorage.clearSessions(); renderHistory();
    });
    $('prClearMistakesBtn').addEventListener('click', () => {
      if (!confirm('Clear the saved mistake bank?')) return;
      PracticeStorage.clearMistakes(); renderMistakeBank();
    });
    $('prClearVocabBtn').addEventListener('click', () => {
      if (!confirm('Clear saved vocabulary?')) return;
      PracticeStorage.clearVocab();
    });
    $('prClearApiBtn').addEventListener('click', () => {
      if (!confirm('Remove your stored API configuration? You will need to re-enter it.')) return;
      PracticeStorage.clearAIConfig();
      state.aiConfig = PracticeStorage.getAIConfig();
      loadAIConfigIntoForm();
      updateStatusPill();
    });
  }

  /* ================= END SESSION / REPORT ================= */
  function endSession() {
    if (!state.sessionStart) return;
    const durationMinutes = Math.max(1, Math.round((Date.now() - state.sessionStart) / 60000));
    const catMeta = CATEGORY_META.find(c => c.id === state.category) || {};
    const session = {
      date: new Date().toISOString(),
      category: state.category,
      categoryLabel: catMeta.en || state.category,
      difficulty: state.difficulty,
      durationMinutes: durationMinutes,
      messageCount: state.displayMessages.filter(m => m.role === 'user' || m.role === 'ai').length,
      hintsUsed: state.hintsUsed,
      translationsUsed: state.translationsUsed,
      corrections: state.pendingCorrections.slice(),
      newVocab: state.pendingVocab.slice(),
      messages: state.displayMessages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        text: m.text, kr: m.text, romanization: m.romanization, translation: m.translation
      })),
      mistakeBankSnapshot: PracticeStorage.getMistakes().slice(0, 20)
    };
    PracticeStorage.saveSession(session);
    state.lastReportSession = session;
    renderReport(session);
    openReportModal();
  }

  function renderReport(session) {
    const body = $('prReportBody');
    body.innerHTML =
      row('Duration', session.durationMinutes + ' min') +
      row('Category', session.categoryLabel) +
      row('Difficulty', session.difficulty) +
      row('Messages exchanged', session.messageCount) +
      row('Hints used', session.hintsUsed) +
      row('Translations used', session.translationsUsed) +
      row('Corrections', session.corrections.length) +
      row('New vocabulary', session.newVocab.length) +
      (session.newVocab.length ? block('New Vocabulary', session.newVocab.map(v => v.kr + (v.en ? ' — ' + v.en : '')).join('<br>')) : '') +
      (session.corrections.length ? block('Common Mistakes', session.corrections.map(c => escapeHtml(c.original) + ' → ' + escapeHtml(c.corrected)).join('<br>')) : '');

    const opts = $('prPdfOptions');
    const fields = ['summary', 'conversation', 'corrections', 'vocabulary', 'romanization', 'translation', 'mistakeInfo'];
    opts.innerHTML = fields.map(f =>
      '<label><input type="checkbox" class="pr-pdf-opt" value="' + f + '" checked> ' + f + '</label>'
    ).join('');
  }
  function row(label, val) { return '<div class="pr-report-row"><span>' + escapeHtml(label) + '</span><span>' + escapeHtml(val) + '</span></div>'; }
  function block(title, html) { return '<div class="pr-report-block"><h3>' + escapeHtml(title) + '</h3><div style="font-family:var(--kr-font)">' + html + '</div></div>'; }

  function wireReportModal() {
    $('prReportClose').addEventListener('click', closeReportModal);
    $('prReportBackdrop').addEventListener('click', (e) => { if (e.target === $('prReportBackdrop')) closeReportModal(); });
    $('prPracticeAgainBtn').addEventListener('click', function () {
      closeReportModal();
      $('prConvo').style.display = 'none';
      $('prSetup').style.display = 'flex';
      $('prSetupHint').textContent = '';
    });
    $('prDownloadPdfBtn').addEventListener('click', function () {
      if (!state.lastReportSession) return;
      const opts = {};
      document.querySelectorAll('.pr-pdf-opt').forEach(cb => { opts[cb.value] = cb.checked; });
      PracticePDFExport.exportSession(state.lastReportSession, opts);
    });
  }
  function openReportModal() { $('prReportBackdrop').classList.add('open'); }
  function closeReportModal() { $('prReportBackdrop').classList.remove('open'); }

  document.addEventListener('DOMContentLoaded', init);
})();
