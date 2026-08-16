/* ============================================================
   HANGUL VIRTUAL KEYBOARD
   A self-contained 2-beolsik (두벌식) on-screen keyboard that
   composes real Hangul syllable blocks as the learner taps
   jamo, the same way a phone's Korean IME would — but built in
   so learners don't need to install one to use PRACTICE.

   Attaches to any <textarea>/<input> via HangulKeyboard.attach().
   Depends on nothing else (works standalone from hangulUtils.js).
   ============================================================ */

const HangulKeyboard = (function () {

  const CHO_LIST  = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
  const JUNG_LIST = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
  const JONG_LIST = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

  const JUNG_COMBINE = { 'ㅗㅏ':'ㅘ', 'ㅗㅐ':'ㅙ', 'ㅗㅣ':'ㅚ', 'ㅜㅓ':'ㅝ', 'ㅜㅔ':'ㅞ', 'ㅜㅣ':'ㅟ', 'ㅡㅣ':'ㅢ' };
  const JONG_COMBINE = { 'ㄱㅅ':'ㄳ', 'ㄴㅈ':'ㄵ', 'ㄴㅎ':'ㄶ', 'ㄹㄱ':'ㄺ', 'ㄹㅁ':'ㄻ', 'ㄹㅂ':'ㄼ', 'ㄹㅅ':'ㄽ', 'ㄹㅌ':'ㄾ', 'ㄹㅍ':'ㄿ', 'ㄹㅎ':'ㅀ', 'ㅂㅅ':'ㅄ' };
  const JONG_SPLIT = {}; // e.g. 'ㄳ' -> ['ㄱ','ㅅ']
  Object.keys(JONG_COMBINE).forEach(pair => { JONG_SPLIT[JONG_COMBINE[pair]] = [pair[0], pair[1]]; });

  function decomposeSyllable(ch) {
    if (!ch) return null;
    const code = ch.codePointAt(0);
    if (code < 0xAC00 || code > 0xD7A3) return null;
    const sIndex = code - 0xAC00;
    return {
      cho: Math.floor(sIndex / (21 * 28)),
      jung: Math.floor((sIndex % (21 * 28)) / 28),
      jong: sIndex % 28
    };
  }

  function composeSyllable(choIdx, jungIdx, jongIdx) {
    if (choIdx < 0 || choIdx > 18 || jungIdx < 0 || jungIdx > 20 || jongIdx < 0 || jongIdx > 27) return null;
    return String.fromCodePoint(0xAC00 + (choIdx * 21 + jungIdx) * 28 + jongIdx);
  }

  /* ---------- key layout ---------- */
  // Each row entry: [base, shifted-or-null]
  const ROWS = [
    [['ㅂ','ㅃ'], ['ㅈ','ㅉ'], ['ㄷ','ㄸ'], ['ㄱ','ㄲ'], ['ㅅ','ㅆ'], ['ㅛ',null], ['ㅕ',null], ['ㅑ',null], ['ㅐ','ㅒ'], ['ㅔ','ㅖ']],
    [['ㅁ',null], ['ㄴ',null], ['ㅇ',null], ['ㄹ',null], ['ㅎ',null], ['ㅗ',null], ['ㅓ',null], ['ㅏ',null], ['ㅣ',null]],
    [['ㅋ',null], ['ㅌ',null], ['ㅊ',null], ['ㅍ',null], ['ㅠ',null], ['ㅜ',null], ['ㅡ',null]]
  ];

  /* ---------- one keyboard instance per attached field ---------- */
  function attach(opts) {
    const input = opts.input;
    const container = opts.container;
    const onToggle = opts.onToggle || function () {};
    let shiftOn = false;
    let visible = false;

    function typeJamo(jamo) {
      input.focus();
      const val = input.value;
      const last = val.slice(-1);
      const decomposed = decomposeSyllable(last);
      const isVowel = JUNG_LIST.indexOf(jamo) !== -1;

      if (isVowel) {
        if (decomposed && decomposed.jong === 0) {
          const combo = JUNG_COMBINE[JUNG_LIST[decomposed.jung] + jamo];
          if (combo) {
            input.value = val.slice(0, -1) + composeSyllable(decomposed.cho, JUNG_LIST.indexOf(combo), 0);
          } else {
            input.value = val + composeSyllable(CHO_LIST.indexOf('ㅇ'), JUNG_LIST.indexOf(jamo), 0);
          }
        } else if (decomposed && decomposed.jong > 0) {
          const jongChar = JONG_LIST[decomposed.jong];
          const split = JONG_SPLIT[jongChar];
          if (split) {
            const prevChar = composeSyllable(decomposed.cho, decomposed.jung, JONG_LIST.indexOf(split[0]));
            const newChar = composeSyllable(CHO_LIST.indexOf(split[1]), JUNG_LIST.indexOf(jamo), 0);
            input.value = val.slice(0, -1) + prevChar + newChar;
          } else {
            const prevChar = composeSyllable(decomposed.cho, decomposed.jung, 0);
            const newChar = composeSyllable(CHO_LIST.indexOf(jongChar), JUNG_LIST.indexOf(jamo), 0);
            input.value = val.slice(0, -1) + prevChar + newChar;
          }
        } else if (last && CHO_LIST.indexOf(last) !== -1) {
          // a lone leading consonant is waiting for its vowel
          input.value = val.slice(0, -1) + composeSyllable(CHO_LIST.indexOf(last), JUNG_LIST.indexOf(jamo), 0);
        } else {
          input.value = val + composeSyllable(CHO_LIST.indexOf('ㅇ'), JUNG_LIST.indexOf(jamo), 0);
        }
      } else {
        // consonant
        if (decomposed && decomposed.jong === 0 && JONG_LIST.indexOf(jamo) !== -1) {
          input.value = val.slice(0, -1) + composeSyllable(decomposed.cho, decomposed.jung, JONG_LIST.indexOf(jamo));
        } else if (decomposed && decomposed.jong > 0) {
          const curJong = JONG_LIST[decomposed.jong];
          const combo = JONG_COMBINE[curJong + jamo];
          if (combo) {
            input.value = val.slice(0, -1) + composeSyllable(decomposed.cho, decomposed.jung, JONG_LIST.indexOf(combo));
          } else {
            input.value = val + jamo;
          }
        } else {
          input.value = val + jamo;
        }
      }
      fireInput();
    }

    function backspace() {
      input.focus();
      const val = input.value;
      if (!val) return;
      const last = val.slice(-1);
      const decomposed = decomposeSyllable(last);
      if (decomposed) {
        if (decomposed.jong > 0) {
          input.value = val.slice(0, -1) + composeSyllable(decomposed.cho, decomposed.jung, 0);
        } else {
          input.value = val.slice(0, -1) + CHO_LIST[decomposed.cho];
        }
      } else {
        input.value = val.slice(0, -1);
      }
      fireInput();
    }

    function space() {
      input.focus();
      input.value += ' ';
      fireInput();
    }

    function fireInput() {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function render() {
      container.innerHTML = '';

      ROWS.forEach((row, rowIndex) => {
        const rowEl = document.createElement('div');
        rowEl.className = 'pr-kbd-row';
        row.forEach(pair => {
          const jamo = (shiftOn && pair[1]) ? pair[1] : pair[0];
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'pr-kbd-key';
          btn.textContent = jamo;
          if (shiftOn && pair[1]) btn.classList.add('is-shifted');
          btn.addEventListener('click', () => typeJamo(jamo));
          rowEl.appendChild(btn);
        });
        container.appendChild(rowEl);
      });

      const bottomRow = document.createElement('div');
      bottomRow.className = 'pr-kbd-row';

      const shiftBtn = document.createElement('button');
      shiftBtn.type = 'button';
      shiftBtn.className = 'pr-kbd-key pr-kbd-wide' + (shiftOn ? ' active' : '');
      shiftBtn.textContent = '⇧';
      shiftBtn.setAttribute('aria-label', 'Shift for double consonants');
      shiftBtn.addEventListener('click', () => { shiftOn = !shiftOn; render(); });
      bottomRow.appendChild(shiftBtn);

      const spaceBtn = document.createElement('button');
      spaceBtn.type = 'button';
      spaceBtn.className = 'pr-kbd-key pr-kbd-space';
      spaceBtn.textContent = 'space';
      spaceBtn.addEventListener('click', space);
      bottomRow.appendChild(spaceBtn);

      const backBtn = document.createElement('button');
      backBtn.type = 'button';
      backBtn.className = 'pr-kbd-key pr-kbd-wide';
      backBtn.textContent = '⌫';
      backBtn.setAttribute('aria-label', 'Backspace');
      backBtn.addEventListener('click', backspace);
      bottomRow.appendChild(backBtn);

      container.appendChild(bottomRow);
    }

    function show() {
      visible = true;
      container.hidden = false;
      render();
      onToggle(true);
    }
    function hide() {
      visible = false;
      container.hidden = true;
      onToggle(false);
    }
    function toggle() {
      if (visible) hide(); else show();
    }
    function isVisible() { return visible; }

    return { show, hide, toggle, isVisible };
  }

  return { attach };
})();
