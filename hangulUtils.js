/* ============================================================
   HANGUL UTILS
   Lightweight Revised-Romanization-style transliteration, done
   locally so romanization never depends on an extra AI call.
   (Simplified — does not implement every liaison/assimilation
   edge case, but is consistent and readable for a learner.)
   ============================================================ */

const HangulUtils = (function () {
  const CHO = ['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  const JUNG = ['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  const JONG = ['','g','kk','gs','n','nj','nh','d','l','lg','lm','lb','ls','lt','lp','lh','m','b','bs','s','ss','ng','j','ch','k','t','p','h'];

  function romanizeSyllable(code) {
    const sIndex = code - 0xAC00;
    const cho = Math.floor(sIndex / (21 * 28));
    const jung = Math.floor((sIndex % (21 * 28)) / 28);
    const jong = sIndex % 28;
    return CHO[cho] + JUNG[jung] + JONG[jong];
  }

  function romanize(text) {
    if (!text) return '';
    let out = '';
    for (const ch of text) {
      const code = ch.codePointAt(0);
      if (code >= 0xAC00 && code <= 0xD7A3) {
        out += romanizeSyllable(code);
      } else {
        out += ch;
      }
    }
    return out;
  }

  function containsHangul(text) {
    return /[\uAC00-\uD7A3]/.test(text || '');
  }

  return { romanize, containsHangul };
})();
