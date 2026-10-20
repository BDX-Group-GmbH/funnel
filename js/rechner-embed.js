/* BDX Rechner-Einbettung: Tabs + iframes (rechner/index.html?modus=…).
   Jeder Rechner lädt erst beim ersten Öffnen und behält seinen Stand beim Tab-Wechsel.
   Höhe kommt per postMessage aus dem iframe (gleiche Origin). */
(function () {
  'use strict';
  var box = document.getElementById('calc-frames');
  if (!box) return;
  var tabs = Array.prototype.slice.call(document.querySelectorAll('.calc-tab'));
  var frames = {};

  function src(modus) {
    var q = new URLSearchParams(location.search), out = new URLSearchParams();
    out.set('modus', modus);
    out.set('seite', location.origin + location.pathname);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(function (k) { if (q.get(k)) out.set(k, q.get(k)); });
    return 'rechner/?' + out.toString();
  }

  function open(modus) {
    tabs.forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-modus') === modus ? 'true' : 'false'); });
    if (!frames[modus]) {
      var f = document.createElement('iframe');
      f.src = src(modus);
      f.title = 'BDX Rechner: ' + modus;
      f.setAttribute('scrolling', 'no');
      f.style.height = '640px';
      box.appendChild(f);
      frames[modus] = f;
    }
    Object.keys(frames).forEach(function (k) { frames[k].hidden = k !== modus; });
  }

  tabs.forEach(function (t) { t.addEventListener('click', function () { open(t.getAttribute('data-modus')); }); });

  window.addEventListener('message', function (ev) {
    if (ev.origin !== location.origin || !ev.data || !ev.data.modus) return;
    var f = frames[ev.data.modus];
    if (!f) return;
    if (ev.data.type === 'bdx-height' && ev.data.height) f.style.height = Math.ceil(ev.data.height) + 'px';
    if (ev.data.type === 'bdx-top') {
      var top = box.getBoundingClientRect().top;
      if (top < 0 || top > window.innerHeight * 0.6) box.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Start erst auf der Danke-Seite (dann liegen Kontaktdaten vor, zweites Formular entfällt)
  var started = false;
  document.addEventListener('bdx:danke', function () { if (!started) { started = true; open('steuer'); } });
})();
