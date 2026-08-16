/* ============================================================
   PDF EXPORT (STUDY REPORT)
   Renders the report as a real HTML document (UTF-8, Noto Sans
   KR web font) in a new tab and calls print(), so Hangul is
   drawn by the browser's own text engine — not re-encoded by a
   binary PDF library. This is the most reliable way to guarantee
   no mojibake for Hangul in an exported "PDF" from a purely
   client-side app. The learner picks "Save as PDF" in the print
   dialog.
   ============================================================ */

const PracticePDFExport = (function () {

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function section(title, bodyHtml) {
    if (!bodyHtml) return '';
    return '<div class="rp-section"><h2>' + escapeHtml(title) + '</h2>' + bodyHtml + '</div>';
  }

  function buildReportHtml(session, opts) {
    opts = opts || {};
    const rows = [];

    if (opts.summary !== false) {
      rows.push(section('Session Summary', (
        '<table class="rp-summary">' +
        '<tr><td>Date</td><td>' + escapeHtml(new Date(session.date).toLocaleString()) + '</td></tr>' +
        '<tr><td>Category</td><td>' + escapeHtml(session.categoryLabel) + '</td></tr>' +
        '<tr><td>Difficulty</td><td>' + escapeHtml(session.difficulty) + '</td></tr>' +
        '<tr><td>Duration</td><td>' + escapeHtml(session.durationMinutes) + ' min</td></tr>' +
        '<tr><td>Messages exchanged</td><td>' + escapeHtml(session.messageCount) + '</td></tr>' +
        '<tr><td>Hints used</td><td>' + escapeHtml(session.hintsUsed) + '</td></tr>' +
        '<tr><td>Translations used</td><td>' + escapeHtml(session.translationsUsed) + '</td></tr>' +
        '</table>'
      )));
    }

    if (opts.conversation !== false && session.messages && session.messages.length) {
      const msgHtml = session.messages.map(m => {
        const who = m.role === 'user' ? 'You' : 'Tutor';
        const kr = escapeHtml(m.role === 'user' ? m.text : m.kr);
        const rom = (opts.romanization !== false && m.romanization) ? '<div class="rp-rom">' + escapeHtml(m.romanization) + '</div>' : '';
        const en = (opts.translation !== false && m.translation) ? '<div class="rp-en">' + escapeHtml(m.translation) + '</div>' : '';
        return '<div class="rp-msg rp-msg-' + m.role + '"><div class="rp-who">' + who + '</div><div class="rp-kr">' + kr + '</div>' + rom + en + '</div>';
      }).join('');
      rows.push(section('Conversation', msgHtml));
    }

    if (opts.corrections !== false && session.corrections && session.corrections.length) {
      const corrHtml = session.corrections.map(c => (
        '<div class="rp-corr">' +
        '<div class="rp-corr-cat">' + escapeHtml(c.category) + '</div>' +
        '<div class="rp-corr-orig">' + escapeHtml(c.original) + '</div>' +
        '<div class="rp-corr-arrow">→</div>' +
        '<div class="rp-corr-fixed">' + escapeHtml(c.corrected) + '</div>' +
        (c.explanation ? '<div class="rp-corr-exp">' + escapeHtml(c.explanation) + '</div>' : '') +
        '</div>'
      )).join('');
      rows.push(section('Corrections', corrHtml));
    }

    if (opts.vocabulary !== false && session.newVocab && session.newVocab.length) {
      const vocabHtml = '<table class="rp-vocab">' + session.newVocab.map(v => (
        '<tr><td class="rp-vocab-kr">' + escapeHtml(v.kr) + '</td><td>' + escapeHtml(v.romanization || '') + '</td><td>' + escapeHtml(v.en || '') + '</td></tr>'
      )).join('') + '</table>';
      rows.push(section('New Vocabulary', vocabHtml));
    }

    if (opts.mistakeInfo !== false && session.mistakeBankSnapshot && session.mistakeBankSnapshot.length) {
      const mHtml = '<table class="rp-vocab">' + session.mistakeBankSnapshot.map(m => (
        '<tr><td class="rp-vocab-kr">' + escapeHtml(m.original) + ' → ' + escapeHtml(m.corrected) + '</td><td>' + escapeHtml(m.category) + '</td><td>' + escapeHtml(m.occurrences) + 'x · ' + escapeHtml(m.status) + '</td></tr>'
      )).join('') + '</table>';
      rows.push(section('Mistake Bank', mHtml));
    }

    return (
      '<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8">' +
      '<title>PRACTICE Study Report</title>' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">' +
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>' +
      '<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Sans:wght@400;600&display=swap" rel="stylesheet">' +
      '<style>' +
      'body{font-family:"Noto Sans",-apple-system,sans-serif;color:#1a1a18;padding:32px;max-width:760px;margin:0 auto;line-height:1.6}' +
      'h1{font-family:"Noto Sans KR",sans-serif;font-size:22px;margin-bottom:4px}' +
      '.rp-date{color:#777;font-size:12px;margin-bottom:28px}' +
      '.rp-section{margin-bottom:28px;page-break-inside:avoid}' +
      '.rp-section h2{font-size:14px;text-transform:uppercase;letter-spacing:0.06em;color:#555;border-bottom:1px solid #ddd;padding-bottom:6px;margin-bottom:12px}' +
      'table.rp-summary td{padding:4px 10px 4px 0;font-size:13px}' +
      'table.rp-summary td:first-child{color:#777}' +
      '.rp-msg{margin-bottom:14px;padding-left:10px;border-left:2px solid #eee}' +
      '.rp-msg-assistant{border-left-color:#4A7C59}' +
      '.rp-who{font-size:10px;text-transform:uppercase;color:#999;margin-bottom:2px}' +
      '.rp-kr{font-family:"Noto Sans KR",sans-serif;font-size:15px}' +
      '.rp-rom{font-size:11px;color:#999;font-style:italic}' +
      '.rp-en{font-size:12px;color:#666;margin-top:2px}' +
      '.rp-corr{border:1px solid #eee;border-radius:6px;padding:10px 12px;margin-bottom:10px;font-size:13px}' +
      '.rp-corr-cat{font-size:10px;text-transform:uppercase;letter-spacing:0.05em;color:#B07A3A;margin-bottom:4px}' +
      '.rp-corr-orig{font-family:"Noto Sans KR",sans-serif;text-decoration:line-through;color:#999}' +
      '.rp-corr-arrow{color:#aaa;margin:2px 0}' +
      '.rp-corr-fixed{font-family:"Noto Sans KR",sans-serif;color:#2f5a3d;font-weight:500}' +
      '.rp-corr-exp{color:#666;font-size:12px;margin-top:4px}' +
      'table.rp-vocab{width:100%;border-collapse:collapse;font-size:13px}' +
      'table.rp-vocab td{padding:6px 8px;border-bottom:1px solid #f0f0f0}' +
      '.rp-vocab-kr{font-family:"Noto Sans KR",sans-serif}' +
      '@media print{body{padding:0}}' +
      '</style></head><body>' +
      '<h1>PRACTICE — Korean Study Report</h1>' +
      '<div class="rp-date">' + escapeHtml(new Date(session.date).toLocaleString()) + '</div>' +
      rows.join('') +
      '<script>window.onload=function(){setTimeout(function(){window.print();},350);};</script>' +
      '</body></html>'
    );
  }

  function exportSession(session, opts) {
    const html = buildReportHtml(session, opts);
    const win = window.open('', '_blank');
    if (!win) {
      alert('Please allow pop-ups to download the Study PDF.');
      return false;
    }
    win.document.open('text/html', 'replace');
    win.document.write(html);
    win.document.close();
    return true;
  }

  return { exportSession, buildReportHtml };
})();
