/* ============================================================
   PRACTICE STORAGE
   Namespaced localStorage layer for the PRACTICE conversation
   trainer. Deliberately kept separate from STORAGE_KEY
   ('koreanLearning') used by the rest of the app so nothing
   here can collide with or corrupt existing saved progress.
   ============================================================ */

const PracticeStorage = (function () {
  const KEYS = {
    aiConfig: 'koreanPractice_aiConfig',
    memory: 'koreanPractice_memory',
    mistakes: 'koreanPractice_mistakes',
    vocab: 'koreanPractice_vocab',
    sessions: 'koreanPractice_sessions'
  };

  function safeGet(key, fallback) {
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function safeSet(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      return false;
    }
  }

  /* ---------- AI Config ---------- */
  function getAIConfig() {
    return safeGet(KEYS.aiConfig, {
      provider: 'groq',
      baseUrl: '',
      apiKey: '',
      model: '',
      temperature: 0.8,
      maxTokens: 400,
      systemInstructions: ''
    });
  }
  function setAIConfig(cfg) { return safeSet(KEYS.aiConfig, cfg); }
  function clearAIConfig() {
    try { window.localStorage.removeItem(KEYS.aiConfig); } catch (e) {}
  }

  /* ---------- Practice Memory (personalization summary) ---------- */
  function getMemory() {
    return safeGet(KEYS.memory, {
      strugglesWith: {},   // category -> count, e.g. { particles: 4, pastTense: 2 }
      knownWell: {},       // topic -> true
      totalSessions: 0,
      totalMinutes: 0,
      lastCategory: null,
      lastDifficulty: null
    });
  }
  function setMemory(mem) { return safeSet(KEYS.memory, mem); }
  function clearMemory() { try { window.localStorage.removeItem(KEYS.memory); } catch (e) {} }

  function recordStruggle(category) {
    const mem = getMemory();
    mem.strugglesWith[category] = (mem.strugglesWith[category] || 0) + 1;
    setMemory(mem);
  }

  /* ---------- Mistake Bank ---------- */
  function getMistakes() { return safeGet(KEYS.mistakes, []); }
  function setMistakes(list) { return safeSet(KEYS.mistakes, list); }
  function clearMistakes() { try { window.localStorage.removeItem(KEYS.mistakes); } catch (e) {} }

  function addOrUpdateMistake(mistake) {
    // mistake: { original, corrected, explanation, category }
    const list = getMistakes();
    const existing = list.find(m => m.original.trim() === mistake.original.trim());
    const now = new Date().toISOString();
    if (existing) {
      existing.occurrences += 1;
      existing.lastOccurrence = now;
      existing.corrected = mistake.corrected || existing.corrected;
      existing.explanation = mistake.explanation || existing.explanation;
      existing.category = mistake.category || existing.category;
      existing.status = existing.occurrences >= 4 ? 'needs-practice' : existing.status;
    } else {
      list.unshift({
        id: 'm_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        original: mistake.original,
        corrected: mistake.corrected,
        explanation: mistake.explanation || '',
        category: mistake.category || 'General',
        occurrences: 1,
        firstOccurrence: now,
        lastOccurrence: now,
        status: 'needs-practice'
      });
    }
    setMistakes(list);
    if (mistake.category) recordStruggle(mistake.category);
  }

  function setMistakeStatus(id, status) {
    const list = getMistakes();
    const m = list.find(x => x.id === id);
    if (m) { m.status = status; setMistakes(list); }
  }

  /* ---------- Saved Vocabulary ---------- */
  function getVocab() { return safeGet(KEYS.vocab, []); }
  function setVocab(list) { return safeSet(KEYS.vocab, list); }
  function clearVocab() { try { window.localStorage.removeItem(KEYS.vocab); } catch (e) {} }

  function saveVocabWord(word) {
    // word: { kr, romanization, en }
    const list = getVocab();
    if (!list.find(w => w.kr === word.kr)) {
      list.unshift(Object.assign({ savedAt: new Date().toISOString() }, word));
      setVocab(list);
    }
  }

  /* ---------- Sessions (history + reports) ---------- */
  function getSessions() { return safeGet(KEYS.sessions, []); }
  function setSessions(list) { return safeSet(KEYS.sessions, list); }
  function clearSessions() { try { window.localStorage.removeItem(KEYS.sessions); } catch (e) {} }

  function saveSession(session) {
    const list = getSessions();
    list.unshift(session);
    // Keep storage bounded — retain the most recent 50 sessions.
    setSessions(list.slice(0, 50));

    const mem = getMemory();
    mem.totalSessions += 1;
    mem.totalMinutes += session.durationMinutes || 0;
    mem.lastCategory = session.category;
    mem.lastDifficulty = session.difficulty;
    setMemory(mem);
  }

  function clearAllPracticeData() {
    clearMemory();
    clearMistakes();
    clearVocab();
    clearSessions();
  }

  return {
    getAIConfig, setAIConfig, clearAIConfig,
    getMemory, setMemory, clearMemory, recordStruggle,
    getMistakes, setMistakes, clearMistakes, addOrUpdateMistake, setMistakeStatus,
    getVocab, setVocab, clearVocab, saveVocabWord,
    getSessions, setSessions, clearSessions, saveSession,
    clearAllPracticeData
  };
})();
