/* BDX Ergebnis-Einbettung auf der Danke-Seite.
   Frage 1 im Funnel bestimmt den Rechner (steuer | cashflow | kaufpreis). Nach dem Absenden lädt genau dieser Rechner
   im Ergebnis-Modus (rechner/?modus=…&ergebnis=1): Antworten aus sessionStorage bdx_rechner, keine Fragen, kein zweiter Lead.
   Höhe kommt per postMessage aus dem iframe (gleiche Origin). */
(function () {
  'use strict';
  var box = document.getElementById('calc-frames');
  if (!box) return;
  var TITEL = { steuer: 'deine Steuerersparnis', cashflow: 'dein monatlicher Cashflow', kaufpreis: 'dein passender Kaufpreis' };
  var frame = null;

  function src(modus) {
    var q = new URLSearchParams(location.search), out = new URLSearchParams();
    out.set('modus', modus);
    out.set('ergebnis', '1');
    out.set('seite', location.origin + location.pathname);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(function (k) { if (q.get(k)) out.set(k, q.get(k)); });
    return 'rechner/?' + out.toString();
  }

  window.addEventListener('message', function (ev) {
    if (ev.origin !== location.origin || !ev.data || !frame) return;
    if (ev.data.type === 'bdx-height' && ev.data.height) frame.style.height = Math.ceil(ev.data.height) + 'px';
  });

  document.addEventListener('bdx:danke', function (ev) {
    var modus = (ev.detail && ev.detail.modus) || 'steuer';
    var t = document.getElementById('ergebnis-titel');
    if (t) t.textContent = TITEL[modus] || '';
    if (frame) frame.remove();
    frame = document.createElement('iframe');
    frame.src = src(modus);
    frame.title = 'Deine persönliche Auswertung';
    frame.setAttribute('scrolling', 'no');
    frame.style.height = '720px';
    box.appendChild(frame);
  });
})();
