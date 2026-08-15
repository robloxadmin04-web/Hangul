/* ============================================================
   HANGUL — HOW IT WORKS (Interactive Product Showcase)
   Self-contained demo logic. Uses isolated demoState only —
   never touches the real dashboard's appState or localStorage.
   ============================================================ */

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------- ISOLATED DEMO DATA (mirrors real app data,
   but is never written back to appState or localStorage) ---------------- */
const demoState = {
  hangul: {
    consonants: [
      { char: 'ㄱ', rom: 'g/k', name: 'Giyeok', example: '가', exEn: 'go / ga' },
      { char: 'ㄴ', rom: 'n', name: 'Nieun', example: '나', exEn: 'I / na' },
      { char: 'ㄷ', rom: 'd/t', name: 'Digeut', example: '다', exEn: 'da' },
      { char: 'ㄹ', rom: 'r/l', name: 'Rieul', example: '라', exEn: 'la' },
      { char: 'ㅁ', rom: 'm', name: 'Mieum', example: '마', exEn: 'ma' },
    ],
  },
  vocab: [
    { kr: '학교', en: 'school', exKr: '학교에 가요.', exEn: 'I go to school.' },
    { kr: '친구', en: 'friend', exKr: '제 친구예요.', exEn: 'This is my friend.' },
    { kr: '감사합니다', en: 'thank you (formal)', exKr: '감사합니다!', exEn: 'Thank you!' },
    { kr: '물', en: 'water', exKr: '물을 마셔요.', exEn: 'I drink water.' },
  ],
  grammar: {
    a: { label: '은/는', meaning: 'Marks the topic — what the sentence is about.',
      examples: [{ kr: '저는 학생이에요.', en: 'I am a student. (topic: as for me)' }],
      usage: 'Use 은/는 for topics, generalizations, and contrast.' },
    b: { label: '이/가', meaning: 'Marks the grammatical subject, often introducing new or contrasted information.',
      examples: [{ kr: '제가 학생이에요.', en: 'I am the student. (identifying who, among others)' }],
      usage: 'Use 이/가 for new information and questions like "who/what."' },
  },
  curriculum: [
    { name: 'Hangul Foundation', desc: 'Consonants, vowels, syllable blocks, batchim', count: 8 },
    { name: 'Beginner Korean', desc: 'Greetings, particles, basic sentence order', count: 8 },
    { name: 'Elementary Korean', desc: 'Past tense, counters, everyday situations', count: 8 },
    { name: 'Intermediate Korean', desc: 'Connectors, longer sentence structures', count: 8 },
    { name: 'Natural Korean', desc: 'Common patterns used in everyday speech', count: 3 },
    { name: 'Honorifics & Speech Levels', desc: 'Formality and register', count: 3 },
    { name: 'Advanced Korean', desc: 'Idioms, proverbs, opinion writing', count: 4 },
    { name: 'Highly Proficient', desc: 'Debate language, register shifting', count: 2 },
    { name: 'Immersion', desc: 'Reading and thinking entirely in Korean', count: 2 },
  ],
  builder: {
    answer: ['저는', '학교에', '가요'],
    blocks: ['저는', '학교에', '가요', '밥을', '먹어요'],
  },
  conversation: {
    level: 'Beginner',
    situation: 'You run into a classmate before class starts.',
    lines: [
      { speaker: '급우', role: 'other', kr: '안녕! 오늘 뭐 해?', en: 'Hey! What are you doing today?' },
      { speaker: 'You', role: 'learner', kr: '나? 도서관에서 공부하려고.', en: 'Me? I\'m planning to study at the library.' },
      { speaker: '급우', role: 'other', kr: '오, 나도 같이 가도 돼?', en: 'Oh, can I come along too?' },
      { speaker: 'You', role: 'learner', kr: '그럼, 좋아!', en: 'Sure, sounds good!' },
    ],
  },
  mastery: [
    { name: 'Hangul', score: 0.92 },
    { name: 'Vocabulary', score: 0.61 },
    { name: 'Grammar', score: 0.38 },
    { name: 'Sentence Construction', score: 0.24 },
    { name: 'Listening', score: 0.55 },
    { name: 'Writing', score: 0.08 },
  ],
  levels: ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Highly Proficient', 'Immersion'],
  levelDemoCurrent: 'Intermediate',
  topik: {
    I: { title: 'TOPIK I — Beginner Track', desc: 'Covers lessons from Hangul Foundation through early Elementary Korean — basic vocabulary, everyday expressions, and simple sentence structures.' },
    II: { title: 'TOPIK II — Intermediate–Advanced Track', desc: 'Draws from Intermediate Korean through Advanced Korean — connective grammar, opinion expression, and more complex reading passages.' },
  },
  keyboard: {
    consonants: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ'],
    vowels: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅜ', 'ㅡ', 'ㅣ'],
  },
};

/* ---------------- SPEECH (ko-KR, browser synthesis only) ---------------- */
let koreanVoice = null;
function initSpeech() {
  if (!('speechSynthesis' in window)) return;
  function pickVoice() {
    const voices = window.speechSynthesis.getVoices();
    koreanVoice = voices.find(v => v.lang === 'ko-KR') || voices.find(v => v.lang && v.lang.indexOf('ko') === 0) || null;
  }
  pickVoice();
  if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = pickVoice;
}
function speak(text) {
  if (!text || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    if (koreanVoice) utter.voice = koreanVoice;
    window.speechSynthesis.speak(utter);
  } catch (e) { /* speech unavailable — fail silently */ }
}
function bindListenButtons(root) {
  (root || document).querySelectorAll('.listen-btn[data-speak]').forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = '1';
    if (!('speechSynthesis' in window)) {
      btn.disabled = true;
      btn.title = 'Speech synthesis unavailable in this browser';
      return;
    }
    btn.addEventListener('click', () => speak(btn.dataset.speak));
  });
}

/* ---------------- MOBILE NAV DRAWER ---------------- */
function initMobileNav() {
  const toggle = document.getElementById('mnavToggle');
  const drawer = document.getElementById('mnavDrawer');
  const backdrop = document.getElementById('mnavBackdrop');
  if (!toggle || !drawer || !backdrop) return;
  function open() { drawer.classList.add('open'); backdrop.classList.add('visible'); toggle.setAttribute('aria-expanded', 'true'); }
  function close() { drawer.classList.remove('open'); backdrop.classList.remove('visible'); toggle.setAttribute('aria-expanded', 'false'); }
  toggle.addEventListener('click', () => { drawer.classList.contains('open') ? close() : open(); });
  backdrop.addEventListener('click', close);
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ---------------- NAV SCROLL PROGRESS ---------------- */
function initNavProgress() {
  const fill = document.getElementById('navProgressFill');
  if (!fill) return;
  function update() {
    const h = document.documentElement;
    const scrollable = h.scrollHeight - h.clientHeight;
    const pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
    fill.style.width = Math.min(100, Math.max(0, pct)) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------------- SCROLL REVEAL ---------------- */
function initScrollReveal() {
  const sections = document.querySelectorAll('.demo-section');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    sections.forEach(s => s.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  sections.forEach(s => io.observe(s));
}

/* ---------------- 01 HANGUL FOUNDATION ---------------- */
function initHangulDemo() {
  const grid = document.getElementById('hfGrid');
  const detail = document.getElementById('hfDetail');
  if (!grid || !detail) return;
  demoState.hangul.consonants.forEach(c => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'hf-cell';
    cell.setAttribute('aria-label', 'Explore ' + c.char);
    cell.innerHTML = '<div class="hf-cell-char">' + c.char + '</div>';
    cell.addEventListener('click', () => {
      grid.querySelectorAll('.hf-cell').forEach(el => el.classList.remove('selected'));
      cell.classList.add('selected');
      detail.innerHTML =
        '<div class="hf-detail-char">' + c.char + '</div>' +
        '<div class="hf-detail-info">' +
          '<div class="hf-detail-name">' + c.name + '</div>' +
          '<div class="hf-detail-rom">' + c.rom + '</div>' +
          '<div class="hf-detail-example"><span class="ex-kr">' + c.example + '</span><span class="ex-en">' + c.exEn + '</span></div>' +
          '<button class="listen-btn" style="margin-top:12px" data-speak="' + c.example + '"><span class="listen-icon">▸</span> Listen</button>' +
        '</div>';
      bindListenButtons(detail);
    });
    grid.appendChild(cell);
  });
}

/* ---------------- 02 VOCABULARY ---------------- */
function initVocabDemo() {
  let idx = 0;
  const krEl = document.getElementById('vocabKr');
  const meaningEl = document.getElementById('vocabMeaning');
  const exampleEl = document.getElementById('vocabExample');
  const meaningBtn = document.getElementById('vocabMeaningBtn');
  const exampleBtn = document.getElementById('vocabExampleBtn');
  const nextBtn = document.getElementById('vocabNextBtn');
  if (!krEl) return;

  function render() {
    const item = demoState.vocab[idx % demoState.vocab.length];
    krEl.textContent = item.kr;
    meaningEl.textContent = item.en;
    exampleEl.innerHTML = '<span class="ex-kr">' + item.exKr + '</span><span class="ex-en">' + item.exEn + '</span>';
    meaningEl.classList.remove('shown');
    exampleEl.classList.remove('shown');
    meaningBtn.setAttribute('aria-expanded', 'false');
    exampleBtn.setAttribute('aria-expanded', 'false');
  }
  meaningBtn.addEventListener('click', () => {
    const shown = meaningEl.classList.toggle('shown');
    meaningBtn.setAttribute('aria-expanded', shown ? 'true' : 'false');
  });
  exampleBtn.addEventListener('click', () => {
    const shown = exampleEl.classList.toggle('shown');
    exampleBtn.setAttribute('aria-expanded', shown ? 'true' : 'false');
  });
  nextBtn.addEventListener('click', () => { idx++; render(); });
  render();
}

/* ---------------- 03 GRAMMAR ---------------- */
function initGrammarDemo() {
  const tabA = document.getElementById('grTabA');
  const tabB = document.getElementById('grTabB');
  const panel = document.getElementById('grPanel');
  if (!tabA || !tabB || !panel) return;

  function render(key) {
    const g = demoState.grammar[key];
    tabA.classList.toggle('active', key === 'a');
    tabB.classList.toggle('active', key === 'b');
    tabA.setAttribute('aria-selected', key === 'a' ? 'true' : 'false');
    tabB.setAttribute('aria-selected', key === 'b' ? 'true' : 'false');
    panel.innerHTML =
      '<p class="gr-meaning">' + g.meaning + '</p>' +
      '<div class="gr-examples">' + g.examples.map(e => '<div class="gr-example"><div class="gr-example-kr">' + e.kr + '</div><div class="gr-example-en">' + e.en + '</div></div>').join('') + '</div>' +
      '<p class="gr-usage">' + g.usage + '</p>';
  }
  tabA.addEventListener('click', () => render('a'));
  tabB.addEventListener('click', () => render('b'));
  render('a');
}

/* ---------------- 04 LESSONS / CURRICULUM PATH ---------------- */
function initLessonsDemo() {
  const path = document.getElementById('lpPath');
  if (!path) return;
  demoState.curriculum.forEach((stage, i) => {
    if (i > 0) {
      const connector = document.createElement('div');
      connector.className = 'lp-connector';
      path.appendChild(connector);
    }
    const step = document.createElement('div');
    step.className = 'lp-step';
    step.innerHTML =
      '<span class="lp-num">' + String(i + 1).padStart(2, '0') + '</span>' +
      '<div style="flex:1"><div class="lp-name">' + stage.name + '</div><div class="lp-desc">' + stage.desc + '</div></div>' +
      '<span class="lp-count">' + stage.count + ' lessons</span>';
    path.appendChild(step);
  });

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    path.querySelectorAll('.lp-step').forEach(s => s.classList.add('shown'));
    return;
  }
  const steps = Array.from(path.querySelectorAll('.lp-step'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const i = steps.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('shown'), i * 60);
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  steps.forEach(s => io.observe(s));
}

/* ---------------- 05 SENTENCE BUILDER ---------------- */
function initBuilderDemo() {
  const slotsEl = document.getElementById('sbSlots');
  const blocksEl = document.getElementById('sbBlocks');
  const completeEl = document.getElementById('sbComplete');
  const resetBtn = document.getElementById('sbResetBtn');
  if (!slotsEl || !blocksEl) return;

  let placed = [];
  let usedIdx = {};

  function render() {
    slotsEl.innerHTML = placed.map(w => '<span class="sb-slot-tile">' + w + '</span>').join('');
    blocksEl.innerHTML = '';
    demoState.builder.blocks.forEach((word, i) => {
      const tile = document.createElement('button');
      tile.type = 'button';
      tile.className = 'sb-block' + (usedIdx[i] ? ' used' : '');
      tile.textContent = word;
      tile.disabled = !!usedIdx[i];
      tile.addEventListener('click', () => {
        usedIdx[i] = true;
        placed.push(word);
        render();
        checkComplete();
      });
      blocksEl.appendChild(tile);
    });
    completeEl.classList.remove('shown');
  }
  function checkComplete() {
    if (placed.length === demoState.builder.answer.length) {
      const isCorrect = placed.every((w, i) => w === demoState.builder.answer[i]);
      if (isCorrect) completeEl.classList.add('shown');
    }
  }
  resetBtn.addEventListener('click', () => { placed = []; usedIdx = {}; render(); });
  render();
}

/* ---------------- 07 DICTATION ---------------- */
function initDictationDemo() {
  const textEl = document.getElementById('dictationText');
  const revealBtn = document.getElementById('dictationRevealBtn');
  if (!textEl || !revealBtn) return;
  revealBtn.addEventListener('click', () => {
    const nowHidden = textEl.classList.toggle('hidden-text');
    revealBtn.textContent = nowHidden ? 'Reveal Sentence' : 'Hide Sentence';
  });
}

/* ---------------- 08 CONVERSATION ---------------- */
function initConversationDemo() {
  const linesEl = document.getElementById('cvLines');
  const prevBtn = document.getElementById('cvPrevBtn');
  const nextBtn = document.getElementById('cvNextBtn');
  const translateBtn = document.getElementById('cvTranslateBtn');
  if (!linesEl) return;

  let lineIdx = 0;
  let showTranslation = {};

  function render() {
    const lines = demoState.conversation.lines;
    let html = '';
    for (let i = 0; i <= lineIdx; i++) {
      const line = lines[i];
      const isActive = i === lineIdx;
      html +=
        '<div class="cv-line ' + (line.role === 'learner' ? 'learner' : '') + '">' +
          '<div class="cv-speaker">' + line.speaker + '</div>' +
          '<div class="cv-line-kr">' + line.kr + ' <button class="listen-btn" data-speak="' + line.kr + '"><span class="listen-icon">▸</span> Listen</button></div>' +
          '<div class="cv-line-en' + (isActive && showTranslation[i] ? ' shown' : '') + '">' + line.en + '</div>' +
        '</div>';
    }
    linesEl.innerHTML = html;
    bindListenButtons(linesEl);
    prevBtn.disabled = lineIdx === 0;
    nextBtn.disabled = lineIdx === lines.length - 1;
    translateBtn.textContent = showTranslation[lineIdx] ? 'Hide Translation' : 'Show Translation';
  }
  prevBtn.addEventListener('click', () => { lineIdx = Math.max(0, lineIdx - 1); render(); });
  nextBtn.addEventListener('click', () => { lineIdx = Math.min(demoState.conversation.lines.length - 1, lineIdx + 1); render(); });
  translateBtn.addEventListener('click', () => { showTranslation[lineIdx] = !showTranslation[lineIdx]; render(); });
  render();
}

/* ---------------- 09 SPEAKING PRACTICE ---------------- */
function initSpeakingDemo() {
  const stepsWrap = document.getElementById('spSteps');
  const advanceBtn = document.getElementById('spAdvanceBtn');
  if (!stepsWrap || !advanceBtn) return;
  let active = -1;
  function render() {
    stepsWrap.querySelectorAll('.sp-step').forEach((el, i) => el.classList.toggle('active', i === active));
  }
  advanceBtn.addEventListener('click', () => {
    active = (active + 1) % 3;
    render();
    advanceBtn.textContent = active === 2 ? 'Restart' : 'Next Step';
  });
}

/* ---------------- 11 ADAPTIVE REVIEW BARS ---------------- */
function initAdaptiveReviewDemo() {
  const section = document.getElementById('demo-adaptive');
  if (!section) return;
  const bars = section.querySelectorAll('.ar-bar-fill');
  function fill() { bars.forEach(b => { b.style.width = (b.dataset.target || 0) + '%'; }); }
  if (prefersReducedMotion || !('IntersectionObserver' in window)) { fill(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { fill(); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(section);
}

/* ---------------- 12 SKILL MASTERY ---------------- */
function masteryLabel(score) {
  if (score <= 0) return 'Not Started';
  if (score < 0.25) return 'Learning';
  if (score < 0.5) return 'Practicing';
  if (score < 0.8) return 'Developing';
  return 'Mastered';
}
function initMasteryDemo() {
  const grid = document.getElementById('msGrid');
  if (!grid) return;
  demoState.mastery.forEach(skill => {
    const label = masteryLabel(skill.score);
    const card = document.createElement('div');
    card.className = 'ms-card ' + label.toLowerCase().replace(' ', '-');
    card.innerHTML =
      '<div class="ms-skill">' + skill.name + '</div>' +
      '<div class="ms-track"><div class="ms-fill" data-target="' + Math.round(skill.score * 100) + '"></div></div>' +
      '<div class="ms-label">' + label + '</div>';
    grid.appendChild(card);
  });
  const section = document.getElementById('demo-mastery');
  function fill() { grid.querySelectorAll('.ms-fill').forEach(f => { f.style.width = (f.dataset.target || 0) + '%'; }); }
  if (prefersReducedMotion || !('IntersectionObserver' in window)) { fill(); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) { fill(); io.disconnect(); } });
  }, { threshold: 0.3 });
  io.observe(section);
}

/* ---------------- 13 LEARNER LEVEL ---------------- */
function initLevelDemo() {
  const path = document.getElementById('lvPath');
  if (!path) return;
  const currentIdx = demoState.levels.indexOf(demoState.levelDemoCurrent);
  demoState.levels.forEach((lvl, i) => {
    if (i > 0) {
      const arrow = document.createElement('span');
      arrow.className = 'lv-arrow';
      arrow.textContent = '→';
      path.appendChild(arrow);
    }
    const step = document.createElement('span');
    step.className = 'lv-step' + (i <= currentIdx ? ' hit' : '');
    step.textContent = lvl;
    path.appendChild(step);
  });
}

/* ---------------- 14 TOPIK ---------------- */
function initTopikDemo() {
  const tabI = document.getElementById('tpTabI');
  const tabII = document.getElementById('tpTabII');
  const panel = document.getElementById('tpPanel');
  if (!tabI || !tabII || !panel) return;
  function render(key) {
    const t = demoState.topik[key];
    tabI.classList.toggle('active', key === 'I');
    tabII.classList.toggle('active', key === 'II');
    tabI.setAttribute('aria-selected', key === 'I' ? 'true' : 'false');
    tabII.setAttribute('aria-selected', key === 'II' ? 'true' : 'false');
    panel.innerHTML = '<div class="tp-panel-title">' + t.title + '</div><div class="tp-panel-desc">' + t.desc + '</div>';
  }
  tabI.addEventListener('click', () => render('I'));
  tabII.addEventListener('click', () => render('II'));
  render('I');
}

/* ---------------- 16 ROMANIZATION ---------------- */
function initRomanizationDemo() {
  const romText = document.getElementById('romText');
  const toggleBtn = document.getElementById('romToggleBtn');
  if (!romText || !toggleBtn) return;
  let on = true;
  toggleBtn.addEventListener('click', () => {
    on = !on;
    romText.classList.toggle('off', !on);
    toggleBtn.textContent = 'Romanization: ' + (on ? 'ON' : 'OFF');
    toggleBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
  });
}

/* ---------------- 17 KOREAN KEYBOARD (subset composer) ---------------- */
const CHO_LIST = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const JUNG_LIST = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
function composeHangul(cho, jung) {
  const ci = CHO_LIST.indexOf(cho);
  const vi = JUNG_LIST.indexOf(jung);
  if (ci < 0 || vi < 0) return null;
  return String.fromCharCode(0xAC00 + (ci * 21 + vi) * 28);
}
function initKeyboardDemo() {
  const display = document.getElementById('kbDisplay');
  const consRow = document.getElementById('kbConsonants');
  const vowRow = document.getElementById('kbVowels');
  const clearBtn = document.getElementById('kbClearBtn');
  if (!display || !consRow || !vowRow) return;

  let pendingCho = null;
  let composed = '';

  function updateDisplay() {
    if (composed) {
      display.textContent = composed + (pendingCho ? pendingCho : '');
      display.classList.remove('placeholder');
    } else if (pendingCho) {
      display.textContent = pendingCho;
      display.classList.remove('placeholder');
    } else {
      display.textContent = 'Tap a consonant, then a vowel';
      display.classList.add('placeholder');
    }
  }

  demoState.keyboard.consonants.forEach(ch => {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'kb-key';
    key.textContent = ch;
    key.addEventListener('click', () => { pendingCho = ch; updateDisplay(); });
    consRow.appendChild(key);
  });
  demoState.keyboard.vowels.forEach(ch => {
    const key = document.createElement('button');
    key.type = 'button';
    key.className = 'kb-key';
    key.textContent = ch;
    key.addEventListener('click', () => {
      if (pendingCho) {
        const syllable = composeHangul(pendingCho, ch);
        composed += (syllable || (pendingCho + ch));
        pendingCho = null;
      } else {
        const syllable = composeHangul('ㅇ', ch);
        composed += (syllable || ch);
      }
      updateDisplay();
    });
    vowRow.appendChild(key);
  });
  clearBtn.addEventListener('click', () => { composed = ''; pendingCho = null; updateDisplay(); });
  updateDisplay();
}

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', function () {
  initSpeech();
  initMobileNav();
  initNavProgress();
  initScrollReveal();

  initHangulDemo();
  initVocabDemo();
  initGrammarDemo();
  initLessonsDemo();
  initBuilderDemo();
  bindListenButtons(document);
  initDictationDemo();
  initConversationDemo();
  initSpeakingDemo();
  initAdaptiveReviewDemo();
  initMasteryDemo();
  initLevelDemo();
  initTopikDemo();
  initRomanizationDemo();
  initKeyboardDemo();
});
