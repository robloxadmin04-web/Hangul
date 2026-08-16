/* ============================================================
   TTS SERVICE (PRACTICE)
   Thin wrapper around SpeechSynthesis scoped for the PRACTICE
   page. Independent from the main app's TTS usage elsewhere.
   ============================================================ */

const PracticeTTS = (function () {
  let koreanVoice = null;
  let lastText = '';

  function isSupported() {
    return 'speechSynthesis' in window;
  }

  function pickVoice() {
    if (!isSupported()) return;
    const voices = window.speechSynthesis.getVoices();
    koreanVoice = voices.find(v => v.lang === 'ko-KR') || voices.find(v => v.lang && v.lang.startsWith('ko')) || null;
  }

  if (isSupported()) {
    pickVoice();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      const prev = window.speechSynthesis.onvoiceschanged;
      window.speechSynthesis.onvoiceschanged = function () {
        pickVoice();
        if (typeof prev === 'function') prev();
      };
    }
  }

  function speak(text, opts) {
    if (!isSupported() || !text) return false;
    opts = opts || {};
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ko-KR';
    if (koreanVoice) utter.voice = koreanVoice;
    utter.rate = opts.slow ? 0.6 : 1.0;
    lastText = text;
    window.speechSynthesis.speak(utter);
    return true;
  }

  function replay(opts) {
    if (!lastText) return false;
    return speak(lastText, opts);
  }

  return { isSupported, speak, replay };
})();
