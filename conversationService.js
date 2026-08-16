/* ============================================================
   CONVERSATION SERVICE
   Sits between the PRACTICE UI and AIProvider. Knows how to be
   a Korean tutor (system prompt, difficulty, category) and how
   to keep the AI's replies in one consistent shape. The UI never
   builds a prompt or parses a raw AI response itself.
   ============================================================ */

const ConversationService = (function () {

  const CATEGORY_LABELS = {
    formal: '존댓말 (Formal / polite speech — teachers, strangers, professional settings)',
    casual: '반말 (Casual speech — close friends, informal peers)',
    daily: '일상 대화 (Daily life conversation)',
    friends: '친구와 대화 (Talking with friends)',
    business: '비즈니스 한국어 (Business Korean)',
    texting: '문자 / 채팅 (Texting / chat style Korean)',
    situational: '상황별 대화 (Situational conversation — restaurant, shopping, transportation, travel, directions, ordering food)',
    slang: '속어 / 신조어 (Modern slang and expressions, used naturally and explained when useful)',
    romantic: '연애 대화 (Korean relationship/dating vocabulary and communication — stays a language-learning exercise, not roleplay of real people)',
    roleplay: '역할극 (Roleplay — the learner picks a scenario/persona; stay in character while keeping the exchange language-focused)'
  };

  const DIFFICULTY_GUIDANCE = {
    beginner: 'Use short sentences, very common vocabulary, and simple grammar (present tense, basic particles). One idea per sentence.',
    elementary: 'Use simple, natural sentences with slightly wider vocabulary. Introduce basic past/future tense and common particles.',
    intermediate: 'Use natural everyday sentences with varied vocabulary and moderate conversational pace. Mix sentence lengths.',
    advanced: 'Use natural sentence structures with nuance and idiomatic expressions. Realistic conversational pace and complexity.',
    native: 'Speak like a native speaker actually talks: contractions, natural fillers, appropriate speech-level shifts, and common colloquial expressions. Not textbook-like. Do not make this simply "harder vocabulary" — make it sound like real spoken Korean.'
  };

  function buildSystemPrompt(settings) {
    const categoryDesc = CATEGORY_LABELS[settings.category] || settings.category;
    const difficultyDesc = DIFFICULTY_GUIDANCE[settings.difficulty] || '';
    const roleplayNote = settings.category === 'roleplay' && settings.roleplayScenario
      ? ('\nRoleplay scenario chosen by the learner: ' + settings.roleplayScenario)
      : '';

    const koreanOnly = settings.koreanOnlyMode
      ? 'Stay in Korean as much as possible. Do not translate into English unless the learner explicitly asks for a translation or explanation.'
      : 'Prefer Korean, but you may briefly clarify in English if the learner seems lost.';

    const memoryNote = settings.memorySummary
      ? ('\nWhat you know about this learner from past sessions (use naturally, do not lecture about it):\n' + settings.memorySummary)
      : '';

    const custom = settings.systemInstructions ? ('\nAdditional instructions from the learner:\n' + settings.systemInstructions) : '';

    return [
      'You are a warm, patient Korean conversation tutor inside a language-learning app called PRACTICE.',
      'Conversation category: ' + categoryDesc + roleplayNote,
      'Learner difficulty level: ' + settings.difficulty + '. ' + difficultyDesc,
      koreanOnly,
      'Have a natural back-and-forth conversation. Encourage the learner to respond in Korean. Do not interrupt every message with corrections — only flag genuinely useful mistakes, and keep the conversation flowing.',
      'When you do flag a mistake, distinguish clearly between: grammatically incorrect, correct-but-unnatural phrasing, a more natural alternative, vocabulary improvement, and (if relevant) pronunciation. Never mark valid Korean as "wrong" just because another phrasing is more common — use "more natural alternative" for that instead.',
      'Introduce useful new vocabulary naturally within the conversation, not as a vocabulary list.',
      memoryNote,
      custom,
      '',
      'You must always reply with a single valid JSON object (UTF-8, no markdown fences, no commentary outside the JSON) with EXACTLY these fields:',
      '{',
      '  "reply": "<your Korean reply — the actual message shown to the learner>",',
      '  "romanization": "<romanization of your Korean reply>",',
      '  "translation": "<natural English translation of your Korean reply>",',
      '  "corrections": [ { "original": "<what the learner wrote>", "corrected": "<corrected/more natural version>", "explanation": "<short explanation in English>", "category": "<one of: Grammar, Unnatural Phrasing, More Natural Alternative, Vocabulary, Pronunciation>" } ],',
      '  "newVocab": [ { "kr": "<Korean word/phrase introduced this turn>", "romanization": "<romanization>", "en": "<English meaning>" } ]',
      '}',
      'If there is nothing to correct, "corrections" must be an empty array. If no notable new vocabulary was introduced, "newVocab" must be an empty array. Never omit a field.'
    ].filter(Boolean).join('\n');
  }

  function buildMemorySummary(memory) {
    if (!memory) return '';
    const struggles = Object.entries(memory.strugglesWith || {})
      .sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
    const parts = [];
    if (struggles.length) parts.push('Repeatedly struggles with: ' + struggles.join(', ') + '.');
    if (memory.totalSessions) parts.push('Has completed ' + memory.totalSessions + ' previous PRACTICE session(s).');
    return parts.join(' ');
  }

  // Only send what's needed: system prompt + a trimmed window of recent turns.
  function buildMessages(settings, history) {
    const MAX_TURNS = 14; // recent user/assistant turns kept, oldest trimmed
    const trimmed = history.slice(-MAX_TURNS).map(m => ({
      role: m.role,
      content: m.role === 'assistant' ? JSON.stringify({ reply: m.kr }) : m.text
    }));
    return [{ role: 'system', content: buildSystemPrompt(settings) }].concat(trimmed);
  }

  function parseAIReply(rawText) {
    let cleaned = rawText.trim();
    // Tolerate accidental markdown fences.
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '');
    let data;
    try {
      data = JSON.parse(cleaned);
    } catch (e) {
      // Fall back: treat the whole thing as plain Korean reply text.
      return {
        reply: rawText.trim(),
        romanization: '',
        translation: '',
        corrections: [],
        newVocab: []
      };
    }
    return {
      reply: data.reply || '',
      romanization: data.romanization || '',
      translation: data.translation || '',
      corrections: Array.isArray(data.corrections) ? data.corrections : [],
      newVocab: Array.isArray(data.newVocab) ? data.newVocab : []
    };
  }

  async function sendTurn(config, settings, history) {
    const messages = buildMessages(settings, history);
    const result = await AIProvider.callChat(config, messages);
    if (!result.ok) return { ok: false, error: result.error };
    const parsed = parseAIReply(result.text);
    return { ok: true, data: parsed };
  }

  async function getHint(config, settings, history, level) {
    // level: 1, 2, or 3
    const levelInstruction = {
      1: 'Give only a conceptual clue about what to say — no Korean words yet, just point the learner in the right direction in English.',
      2: 'Give useful Korean vocabulary or sentence structure they could use — a few words or a pattern, not a full sentence.',
      3: 'Give a partially constructed Korean sentence with a blank or two left for the learner to fill in.'
    }[level] || 'Give only a conceptual clue.';

    const messages = buildMessages(settings, history).concat([{
      role: 'user',
      content: '[SYSTEM HINT REQUEST — not part of the conversation] The learner is stuck replying to your last message. ' +
        levelInstruction + ' Respond with a single valid JSON object: {"hint": "<the hint text>"}. Nothing else.'
    }]);

    const result = await AIProvider.callChat(config, messages, { timeoutMs: 20000 });
    if (!result.ok) return { ok: false, error: result.error };
    let hint = result.text.trim();
    try {
      const parsed = JSON.parse(hint.replace(/^```json\s*/i, '').replace(/```\s*$/, ''));
      hint = parsed.hint || hint;
    } catch (e) { /* use raw text */ }
    return { ok: true, hint };
  }

  async function getFullAnswer(config, settings, history) {
    const messages = buildMessages(settings, history).concat([{
      role: 'user',
      content: '[SYSTEM REQUEST — not part of the conversation] Give the single best complete Korean sentence the learner could reply with right now. Respond with JSON: {"answer": "<Korean sentence>", "romanization": "<romanization>"}. Nothing else.'
    }]);
    const result = await AIProvider.callChat(config, messages, { timeoutMs: 20000 });
    if (!result.ok) return { ok: false, error: result.error };
    try {
      const parsed = JSON.parse(result.text.trim().replace(/^```json\s*/i, '').replace(/```\s*$/, ''));
      return { ok: true, answer: parsed.answer || '', romanization: parsed.romanization || '' };
    } catch (e) {
      return { ok: true, answer: result.text.trim(), romanization: '' };
    }
  }

  return {
    CATEGORY_LABELS, DIFFICULTY_GUIDANCE,
    buildSystemPrompt, buildMemorySummary, buildMessages, parseAIReply,
    sendTurn, getHint, getFullAnswer
  };
})();
