/* BDX Group Lead-Funnel · Logik und Inhalte der Fragen.
   Inhalte bearbeiten: Array QUESTIONS unten. Icons: Objekt ICONS (flache, einfarbige SVGs nach BDX-CI). */
(function () {
  'use strict';

  var P = '<svg viewBox="0 0 48 48" fill="currentColor" aria-hidden="true">';
  var E = '</svg>';
  var ICONS = {
    house: P + '<path fill-rule="evenodd" d="M24 5 3 22h6v21h30V22h6L24 5Zm-4 38V30h8v13h-8Z"/>' + E,
    split: P + '<rect x="5" y="8" width="16" height="32" rx="2"/><rect x="27" y="18" width="16" height="22" rx="2"/><rect x="5" y="42" width="38" height="3" rx="1.5"/>' + E,
    compare: P + '<path d="M4 44V14l14-8v38H4Zm5-26v4h4v-4H9Zm0 8v4h4v-4H9Zm0 8v4h4v-4H9Z" fill-rule="evenodd"/><path fill-rule="evenodd" d="M24 44V22l10-8 10 8v22H24Zm6-14v4h8v-4h-8Z"/>' + E,
    coins: P + '<ellipse cx="18" cy="12" rx="13" ry="5"/><path d="M5 16v5c0 2.8 5.8 5 13 5s13-2.2 13-5v-5c-2.4 2.3-7.4 3.6-13 3.6S7.4 18.3 5 16Z"/><path d="M5 25v5c0 2.8 5.8 5 13 5s13-2.2 13-5v-5c-2.4 2.3-7.4 3.6-13 3.6S7.4 27.3 5 25Z"/><path d="M5 34v5c0 2.8 5.8 5 13 5s13-2.2 13-5v-5c-2.4 2.3-7.4 3.6-13 3.6S7.4 36.3 5 34Z"/><circle cx="36" cy="32" r="10"/>' + E,
    percent: P + '<path fill-rule="evenodd" d="M9 3h22l10 10v32H9V3Zm8 17a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm14 10a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm1.6-9.4L15.4 39.4l2.2 2 17.2-18.8-2.2-2Z"/>' + E,
    hourglass: P + '<path d="M10 3h28v5h-3c0 7-4 11.5-8 16 4 4.5 8 9 8 16h3v5H10v-5h3c0-7 4-11.5 8-16-4-4.5-8-9-8-16h-3V3Zm8 37h12c-.6-4.4-3-7.4-6-10.6-3 3.2-5.4 6.2-6 10.6Z"/>' + E,
    houses: P + '<path d="M13 10 1 20h4v16h16V20h4L13 10Z"/><path d="M35 10 23 20h4v16h16V20h4L35 10Z"/><rect x="1" y="39" width="46" height="4" rx="2"/>' + E,
    employee: P + '<circle cx="24" cy="13" r="9"/><path d="M8 45c0-10 6-17 16-17s16 7 16 17H8Z"/><path fill="#fff" d="m22 29 2 3 2-3h-4Zm1 4-2 9 3 3 3-3-2-9h-2Z"/>' + E,
    lead: P + '<circle cx="20" cy="14" r="9"/><path d="M4 45c0-10 6-17 16-17 5 0 9 1.8 12 5L28 45H4Z"/><path d="m38 26 2.6 5.4 5.9.8-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.8L38 26Z"/>' + E,
    briefcase: P + '<path fill-rule="evenodd" d="M17 7h14a3 3 0 0 1 3 3v4h9a3 3 0 0 1 3 3v24a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3h9v-4a3 3 0 0 1 3-3Zm2 4v3h10v-3H19Z"/>' + E,
    shield: P + '<path d="M24 3 6 10v12c0 11 7.6 19.6 18 23 10.4-3.4 18-12 18-23V10L24 3Z"/>' + E,
    bars1: P + '<rect x="5" y="32" width="8" height="12" rx="1.5"/><rect x="15" y="26" width="8" height="18" rx="1.5" opacity=".18"/><rect x="25" y="18" width="8" height="26" rx="1.5" opacity=".18"/><rect x="35" y="8" width="8" height="36" rx="1.5" opacity=".18"/>' + E,
    bars2: P + '<rect x="5" y="32" width="8" height="12" rx="1.5"/><rect x="15" y="26" width="8" height="18" rx="1.5"/><rect x="25" y="18" width="8" height="26" rx="1.5" opacity=".18"/><rect x="35" y="8" width="8" height="36" rx="1.5" opacity=".18"/>' + E,
    bars3: P + '<rect x="5" y="32" width="8" height="12" rx="1.5"/><rect x="15" y="26" width="8" height="18" rx="1.5"/><rect x="25" y="18" width="8" height="26" rx="1.5"/><rect x="35" y="8" width="8" height="36" rx="1.5" opacity=".18"/>' + E,
    bars4: P + '<rect x="5" y="32" width="8" height="12" rx="1.5"/><rect x="15" y="26" width="8" height="18" rx="1.5"/><rect x="25" y="18" width="8" height="26" rx="1.5"/><rect x="35" y="8" width="8" height="36" rx="1.5"/>' + E,
    search: P + '<path fill-rule="evenodd" d="M20 3a17 17 0 1 0 9.9 30.8L41.6 45.5l3.9-3.9-11.7-11.7A17 17 0 0 0 20 3Zm0 6a11 11 0 1 1 0 22 11 11 0 0 1 0-22Z"/>' + E,
    key: P + '<path fill-rule="evenodd" d="M15 6a12 12 0 1 0 10.4 18H31v5h5v5h5v-5h4v-9H25.4A12 12 0 0 0 15 6Zm-3 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z"/>' + E,
    calendar: P + '<path fill-rule="evenodd" d="M13 3h5v4h12V3h5v4h6a3 3 0 0 1 3 3v31a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h6V3ZM9 17v22h30V17H9Zm4 5h7v6h-7v-6Z"/>' + E,
    clock: P + '<path fill-rule="evenodd" d="M24 3a21 21 0 1 0 0 42 21 21 0 0 0 0-42Zm-2.5 9h5v11l8 5.5-2.8 4.1L21.5 26V12Z"/>' + E,
    cashflow: P + '<path d="M6 16h28l-6-6 3.5-3.5L44 19 31.5 31.5 28 28l6-6H6v-6Z"/><path d="M42 32H14l6 6-3.5 3.5L4 29l12.5-12.5L20 20l-6 6h28v6Z" opacity=".45"/>' + E,
    pin: P + '<path fill-rule="evenodd" d="M24 2C15.2 2 8 9 8 17.8 8 30 24 46 24 46s16-16 16-28.2C40 9 32.8 2 24 2Zm0 9a7 7 0 1 1 0 14 7 7 0 0 1 0-14Z"/>' + E,
    handshake: P + '<path d="M2 14h8l4 4 8-5 7 0 7 5h10v18h-8L25 46l-3-3-3 3-3-3-3 3-3-3-1-2-3-4H2V14Z"/><path fill="#fff" opacity=".9" d="m22 22 6 6 8-1-7-6-7 1Z"/>' + E
  };

  var QUESTIONS = [
    { id: 'q1', key: 'ziel', q: 'Was ist dein Hauptziel mit einer Kapitalanlage-Immobilie?', a: [
      ['Vermögen mit Sachwerten aufbauen', 'coins'], ['Einkommensteuer senken', 'percent'],
      ['Altersvorsorge', 'hourglass'], ['Bestehendes Portfolio erweitern', 'houses'] ] },
    { id: 'q2', key: 'beruf', q: 'Wie sieht deine berufliche Situation aus?', a: [
      ['Angestellt, unbefristet', 'employee'], ['Führungskraft / leitende Position', 'lead'],
      ['Selbstständig / Unternehmer', 'briefcase'], ['Verbeamtet', 'shield'] ] },
    { id: 'q3', key: 'einkommen', q: 'Wie hoch ist dein Bruttojahreseinkommen?', help: 'Die Angabe bleibt bei uns. Sie bestimmt, welche Wohnung und welcher Steuereffekt in deiner Kalkulation realistisch sind.', a: [
      ['Unter 80.000 €', 'bars1'], ['80.000 bis 120.000 €', 'bars2'],
      ['120.000 bis 250.000 €', 'bars3'], ['Über 250.000 €', 'bars4'] ] },
    { id: 'q4', key: 'eigenkapital', q: 'Wie viel Eigenkapital könntest du für einen Kauf einsetzen?', help: 'Gemeint sind freie Mittel nach deiner Notreserve, zum Beispiel für Kaufnebenkosten.', a: [
      ['Unter 30.000 €', 'bars1'], ['30.000 bis 60.000 €', 'bars2'],
      ['60.000 bis 150.000 €', 'bars3'], ['Über 150.000 €', 'bars4'] ] },
    { id: 'q5', key: 'erfahrung', q: 'Welche Erfahrung hast du bereits mit Immobilien?', a: [
      ['Noch keine', 'search'], ['Selbstgenutzte Immobilie', 'key'],
      ['Eine Kapitalanlage', 'house'], ['Mehrere Kapitalanlagen', 'houses'] ] },
    { id: 'q6', key: 'zeitraum', q: 'Wann möchtest du deine nächste Kapitalanlage kaufen?', a: [
      ['In den nächsten 3 Monaten', 'calendar'], ['In 3 bis 6 Monaten', 'clock'],
      ['In 6 bis 12 Monaten', 'hourglass'], ['Ich informiere mich erst', 'search'] ] },
    { id: 'q7', key: 'prioritaet', q: 'Worauf kommt es dir bei einer Wohnung am meisten an?', a: [
      ['Trägt sich vor Steuern', 'cashflow'], ['Gute Lage in Berlin', 'pin'],
      ['Steuerlicher Effekt', 'percent'], ['Wenig eigener Aufwand', 'handshake'] ] }
  ];

  var ORDER = ['start'].concat(QUESTIONS.map(function (q) { return q.id; }), ['kontakt', 'danke']);
  var answers = {};

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  // Fragen-Screens rendern (nur statische, oben definierte Inhalte; Texte via esc() maskiert, keine Nutzereingaben)
  var host = document.getElementById('questions');
  host.innerHTML = QUESTIONS.map(function (q, i) {
    var seg = QUESTIONS.map(function (_, j) { return '<i' + (j <= i ? ' class="on"' : '') + '></i>'; }).join('');
    var next = ORDER[ORDER.indexOf(q.id) + 1];
    return '<section class="screen" data-s="' + q.id + '" id="' + q.id + '"><div class="wrap center">' +
      '<p class="progress-label">Frage ' + (i + 1) + ' von ' + QUESTIONS.length + '<span class="seg" aria-hidden="true">' + seg + '</span></p>' +
      '<h2 class="h-q">' + esc(q.q) + '</h2>' +
      '<div class="answers" role="group" aria-label="' + esc(q.q) + '">' +
      q.a.map(function (a) {
        return '<button type="button" class="answer" data-key="' + q.key + '" data-val="' + esc(a[0]) + '" data-next="' + next + '">' +
          '<span class="ic">' + ICONS[a[1]] + '</span><span>' + esc(a[0]) + '</span></button>';
      }).join('') + '</div>' +
      (q.help ? '<p class="q-help">' + esc(q.help) + '</p>' : '') +
      '<button type="button" class="back" data-back>← Zurück</button>' +
      '</div></section>';
  }).join('');

  // Statische Icons (Landing)
  Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) { el.innerHTML = ICONS[el.getAttribute('data-icon')] || ''; });

  var current = 'start';
  function show(id, push) {
    if (ORDER.indexOf(id) < 0) id = 'start';
    Array.prototype.forEach.call(document.querySelectorAll('.screen'), function (s) {
      s.classList.toggle('is-active', s.getAttribute('data-s') === id);
    });
    current = id;
    var idx = ORDER.indexOf(id);
    document.getElementById('bar-fill').style.width = Math.round(idx / (ORDER.length - 1) * 100) + '%';
    if (push) history.pushState({ s: id }, '', '#' + id);
    window.scrollTo(0, 0);
    var h = document.querySelector('.screen.is-active h1, .screen.is-active h2');
    if (h && id !== 'start') { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    track('screen_view', { screen: id });
  }

  // Lokales Event-Log (keine Übertragung). Für den Livebetrieb hier CRM/Tracking anbinden.
  window.BDX_EVENTS = [];
  function track(name, data) { window.BDX_EVENTS.push({ e: name, d: data || {}, t: Date.now() }); }

  document.addEventListener('click', function (ev) {
    var go = ev.target.closest('[data-go]');
    if (go) { ev.preventDefault(); show(go.getAttribute('data-go'), true); return; }
    var ans = ev.target.closest('.answer');
    if (ans) {
      answers[ans.getAttribute('data-key')] = ans.getAttribute('data-val');
      Array.prototype.forEach.call(ans.parentNode.children, function (b) { b.classList.toggle('is-picked', b === ans); });
      track('answer', { key: ans.getAttribute('data-key'), val: ans.getAttribute('data-val') });
      setTimeout(function () { show(ans.getAttribute('data-next'), true); }, 180);
      return;
    }
    if (ev.target.closest('[data-back]')) { history.back(); }
  });

  window.addEventListener('popstate', function (ev) {
    var id = (ev.state && ev.state.s) || location.hash.slice(1) || 'start';
    if (id === 'danke' || (ORDER.indexOf(id) > 1 && !answers[QUESTIONS[0].key])) id = 'start';
    show(id, false);
  });

  // Formular: Validierung, keine Datenübertragung in der Testversion
  var form = document.getElementById('lead-form');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll('input'), function (inp) {
      var valid = inp.type === 'checkbox' ? inp.checked : inp.value.trim().length > 1 && (inp.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim()));
      if (inp.type !== 'checkbox') inp.parentNode.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    document.getElementById('form-error').hidden = ok;
    if (!ok) return;
    track('lead_submit_test', { answers: answers });
    history.replaceState({ s: 'danke' }, '', '#danke');
    show('danke', false);
  });

  // Start: Deep-Links auf Zwischenschritte ohne Antworten starten vorne
  var initial = location.hash.slice(1);
  history.replaceState({ s: 'start' }, '', location.pathname + location.search);
  show(initial === 'start' ? 'start' : 'start', false);
})();
