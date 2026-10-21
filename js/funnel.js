/* BDX Group Lead-Funnel · Logik und Inhalte der Fragen.
   Inhalte bearbeiten: Array QUESTIONS unten. Rechen-Engine: js/bdx-engine.js (muss vorher geladen sein). Icons: Objekt ICONS (flache, einfarbige SVGs nach BDX-CI). */
(function () {
  'use strict';

  // Lead-Webhook (n8n). Hinweis: Der Token ist im Browser sichtbar (statische Seite).
  var WEBHOOK_URL = 'https://n8n.srv1043875.hstgr.cloud/webhook/funnel-submit';
  var WEBHOOK_TOKEN = '6453d89e79162bcf776bb2c3ba21e4131fbda6a3cb3dd2cc4bd00da9f2307d87';

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

  // Fragen. Frage 1 ist die Weiche: Sie bestimmt, welcher der 3 Rechner das Ergebnis liefert.
  // a: [Antworttext, Icon, Rechenwert]. pos: Nummer in der Anzeige (alle Pfade haben 7 Fragen).
  var QUESTIONS = [
    { id: 'q1', pos: 1, key: 'ziel', q: 'Was ist dein Hauptziel mit einer Kapitalanlage-Immobilie?', a: [
      ['Vermögen mit Sachwerten aufbauen', 'coins', 'kaufpreis'], ['Einkommensteuer senken', 'percent', 'steuer'],
      ['Altersvorsorge', 'hourglass', 'cashflow'], ['Bestehendes Portfolio erweitern', 'houses', 'kaufpreis'] ] },
    { id: 'q2', pos: 2, key: 'beruf', q: 'Wie sieht deine berufliche Situation aus?', a: [
      ['Angestellt, unbefristet', 'employee'], ['Führungskraft / leitende Position', 'lead'],
      ['Selbstständig / Unternehmer', 'briefcase'], ['Verbeamtet', 'shield'] ] },
    { id: 'q3', pos: 3, key: 'veranlagung', q: 'Wie wirst du steuerlich veranlagt?', help: 'Bei gemeinsamer Veranlagung rechnen wir mit dem Splittingtarif.', a: [
      ['Einzeln', 'employee', false], ['Gemeinsam mit Ehepartner', 'handshake', true] ] },
    { id: 'q4', pos: 4, key: 'einkommen', type: 'zahl', q: 'Wie hoch ist dein Bruttojahreseinkommen?',
      help: 'Bei gemeinsamer Veranlagung euer gemeinsames Einkommen. Die Angabe bleibt bei uns und fließt nur in deine Auswertung.',
      chips: [60000, 80000, 120000, 160000, 220000, 300000], min: 20000 },
    { id: 'q5', pos: 5, key: 'eigenkapital', q: 'Wie viel Eigenkapital könntest du für einen Kauf einsetzen?', help: 'Gemeint sind freie Mittel nach deiner Notreserve, zum Beispiel für Kaufnebenkosten.', a: [
      ['Unter 30.000 €', 'bars1', 20000], ['30.000 bis 60.000 €', 'bars2', 45000],
      ['60.000 bis 150.000 €', 'bars3', 100000], ['Über 150.000 €', 'bars4', 200000] ] },
    // Frage 6 je nach Rechner: Monatsbudget (Kaufpreis) oder Kaufpreis-Regler (Steuer, Cashflow)
    { id: 'q6b', pos: 6, key: 'budget_monat', q: 'Wie viel darf dich eine Wohnung im Monat höchstens kosten?', help: 'Nach Miete und nach Steuern, also das, was du selbst zuzahlst.', a: [
      ['Nichts, sie soll sich selbst tragen', 'cashflow', 0], ['Bis 250 €', 'bars1', 250],
      ['Bis 500 €', 'bars2', 500], ['Mehr als 500 €', 'bars3', 1000] ] },
    { id: 'q6p', pos: 6, key: 'kaufpreis', type: 'regler', q: 'Mit welchem Kaufpreis möchtest du rechnen?' },
    { id: 'q7', pos: 7, key: 'prioritaet', q: 'Worauf kommt es dir bei einer Wohnung am meisten an?', a: [
      ['Trägt sich vor Steuern', 'cashflow'], ['Gute Lage in Berlin', 'pin'],
      ['Steuerlicher Effekt', 'percent'], ['Wenig eigener Aufwand', 'handshake'] ] }
  ];
  var TOTAL = 7;
  var C = window.BDX_DEFAULTS;
  var answers = {};   // Klartext fürs CRM
  var calc = { modus: null, beruf: '', verheiratet: false, einkommen: 0, eigenkapital: 0, budget: 0, invest: C.referenzPreis };

  function path() { return ['q1', 'q2', 'q3', 'q4', 'q5', calc.modus === 'kaufpreis' ? 'q6b' : 'q6p', 'q7']; }
  function order() { return ['start'].concat(path(), ['kontakt', 'danke']); }
  function nextOf(id) { var o = order(); return o[o.indexOf(id) + 1] || 'kontakt'; }
  function byId(id) { for (var i = 0; i < QUESTIONS.length; i++) if (QUESTIONS[i].id === id) return QUESTIONS[i]; return null; }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(v) { return new Intl.NumberFormat('de-DE').format(Math.round(v)); }
  function eur(v) { return fmt(v) + ' €'; }
  function parseNum(s) { return parseInt(String(s).replace(/\D/g, ''), 10) || 0; }

  // Fragen-Screens rendern (nur statische, oben definierte Inhalte; Texte via esc() maskiert)
  var host = document.getElementById('questions');
  host.innerHTML = QUESTIONS.map(function (q) {
    var seg = ''; for (var j = 1; j <= TOTAL; j++) seg += '<i' + (j <= q.pos ? ' class="on"' : '') + '></i>';
    var body;
    if (q.type === 'zahl') {
      body = '<div class="num-q"><label class="field num-field"><input id="in-' + q.key + '" inputmode="numeric" autocomplete="off" placeholder="z. B. 120.000" aria-label="' + esc(q.q) + '"><span class="unit">€</span></label>' +
        '<div class="chips">' + q.chips.map(function (v) { return '<button type="button" class="chip" data-chip="' + v + '">' + eur(v) + '</button>'; }).join('') + '</div>' +
        '<button type="button" class="cta block" data-weiter="' + q.id + '" disabled>Weiter →</button></div>';
    } else if (q.type === 'regler') {
      body = '<div class="num-q"><div class="slider-val" id="regler-wert"></div><p class="q-help" id="regler-info"></p>' +
        '<input type="range" id="in-kaufpreis" min="' + C.preisMin + '" max="' + C.preisMax + '" step="10000" value="' + C.referenzPreis + '" aria-label="Kaufpreis">' +
        '<div class="range-ends"><span>' + eur(C.preisMin) + '</span><span>' + eur(C.preisMax) + '</span></div>' +
        '<button type="button" class="cta block" data-weiter="' + q.id + '">Weiter →</button></div>';
    } else {
      body = '<div class="answers" role="group" aria-label="' + esc(q.q) + '">' +
        q.a.map(function (a, k) {
          return '<button type="button" class="answer" data-q="' + q.id + '" data-i="' + k + '">' +
            '<span class="ic">' + ICONS[a[1]] + '</span><span>' + esc(a[0]) + '</span></button>';
        }).join('') + '</div>';
    }
    return '<section class="screen" data-s="' + q.id + '" id="' + q.id + '"><div class="wrap center">' +
      '<p class="progress-label">Frage ' + q.pos + ' von ' + TOTAL + '<span class="seg" aria-hidden="true">' + seg + '</span></p>' +
      '<h2 class="h-q">' + esc(q.q) + '</h2>' + body +
      (q.help && q.type !== 'regler' ? '<p class="q-help">' + esc(q.help) + '</p>' : '') +
      '<button type="button" class="back" data-back>← Zurück</button>' +
      '</div></section>';
  }).join('');

  // Einkommen: Zahlenfeld + Schnellauswahl
  var inEk = document.getElementById('in-einkommen');
  var qEk = byId('q4');
  var goEk = document.querySelector('[data-weiter="q4"]');
  function setEinkommen(v) { calc.einkommen = v; inEk.value = v ? fmt(v) : ''; goEk.disabled = v < qEk.min; }
  inEk.addEventListener('input', function () { setEinkommen(parseNum(inEk.value)); });
  inEk.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !goEk.disabled) goEk.click(); });

  // Kaufpreis-Regler
  var inKp = document.getElementById('in-kaufpreis');
  function updRegler() {
    calc.invest = +inKp.value;
    document.getElementById('regler-wert').textContent = eur(calc.invest);
    document.getElementById('regler-info').textContent = 'Kaufpreis der Wohnung. Dazu kommt die Sanierung mit ' + Math.round(C.sanierungAufKaufpreis * 100) +
      ' % (' + eur(calc.invest * C.sanierungAufKaufpreis) + '), zusammen ' + eur(calc.invest * (1 + C.sanierungAufKaufpreis)) + '.';
  }
  inKp.addEventListener('input', updRegler); updRegler();

  // Statische Icons (Landing)
  Array.prototype.forEach.call(document.querySelectorAll('[data-icon]'), function (el) { el.innerHTML = ICONS[el.getAttribute('data-icon')] || ''; });

  var current = 'start';
  function show(id, push) {
    var o = order();
    if (o.indexOf(id) < 0) id = 'start';
    Array.prototype.forEach.call(document.querySelectorAll('.screen'), function (s) {
      s.classList.toggle('is-active', s.getAttribute('data-s') === id);
    });
    current = id;
    document.getElementById('bar-fill').style.width = Math.round(o.indexOf(id) / (o.length - 1) * 100) + '%';
    if (push) history.pushState({ s: id }, '', '#' + id);
    window.scrollTo(0, 0);
    var h = document.querySelector('.screen.is-active h1, .screen.is-active h2');
    if (h && id !== 'start') { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (id === 'q4' && window.matchMedia('(min-width: 700px)').matches) setTimeout(function () { inEk.focus(); }, 60);
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
      var q = byId(ans.getAttribute('data-q')), a = q.a[+ans.getAttribute('data-i')];
      answers[q.key] = a[0];
      if (q.key === 'ziel') calc.modus = a[2];
      if (q.key === 'beruf') calc.beruf = a[0];
      if (q.key === 'veranlagung') calc.verheiratet = a[2];
      if (q.key === 'eigenkapital') calc.eigenkapital = a[2];
      if (q.key === 'budget_monat') calc.budget = a[2];
      Array.prototype.forEach.call(ans.parentNode.children, function (b) { b.classList.toggle('is-picked', b === ans); });
      track('answer', { key: q.key, val: a[0] });
      setTimeout(function () { show(nextOf(q.id), true); }, 180);
      return;
    }
    var chip = ev.target.closest('[data-chip]');
    if (chip) { setEinkommen(+chip.getAttribute('data-chip')); return; }
    var w = ev.target.closest('[data-weiter]');
    if (w && !w.disabled) {
      var id = w.getAttribute('data-weiter');
      if (id === 'q4') answers.einkommen = eur(calc.einkommen);
      if (id === 'q6p') answers.kaufpreis = eur(calc.invest);
      track('answer', { key: id });
      show(nextOf(id), true);
      return;
    }
    if (ev.target.closest('[data-back]')) { history.back(); }
  });

  window.addEventListener('popstate', function (ev) {
    var id = (ev.state && ev.state.s) || location.hash.slice(1) || 'start';
    if (id === 'danke' || (id !== 'start' && !calc.modus)) id = 'start';
    show(id, false);
  });

  // Ergebnis mit der Rechen-Engine (js/bdx-engine.js), gleiche Logik wie rechner/index.html
  function ergebnis() {
    var zvE = window.BDX.zvEausBrutto(calc.einkommen, calc.beruf);
    var p = { zvE: zvE, verheiratet: !!calc.verheiratet, ks: 0 };
    if (calc.modus === 'kaufpreis') {
      var r = window.BDX.passenderPreis(C, { zvE: zvE, verheiratet: p.verheiratet, ks: 0, eigenkapital: calc.eigenkapital, budgetMonat: calc.budget });
      return { modell: r.modell, hinweis: r.hinweis, zvE: zvE };
    }
    p.invest = calc.invest;
    return { modell: window.BDX.modell(C, p), hinweis: null, zvE: zvE };
  }

  // Formular: Validierung + Versand an den n8n-Webhook
  var form = document.getElementById('lead-form');
  var submitBtn = document.getElementById('cta-submit');
  var errBox = document.getElementById('form-error');
  var ERR_FIELDS = errBox.textContent;
  var sending = false;

  function params() {
    var out = {}, q = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid'].forEach(function (k) { if (q.get(k)) out[k] = q.get(k); });
    return out;
  }

  // Telefonnummer in E.164 (+491701234567): Standardland Deutschland
  function toE164(raw) {
    var v = String(raw).trim().replace(/[^\d+]/g, '');
    if (v.indexOf('00') === 0) v = '+' + v.slice(2);
    if (v.charAt(0) === '+') v = '+' + v.slice(1).replace(/\D/g, '');
    else if (v.charAt(0) === '0') v = '+49' + v.slice(1);
    else v = '+49' + v;
    if (v.indexOf('+490') === 0) v = '+49' + v.slice(4);
    return /^\+[1-9]\d{7,14}$/.test(v) ? v : '';
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (sending) return;
    var ok = true;
    Array.prototype.forEach.call(form.querySelectorAll('input'), function (inp) {
      var valid = inp.type === 'checkbox' ? inp.checked : inp.value.trim().length > 1 && (inp.type !== 'email' || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(inp.value.trim()));
      if (inp.type === 'tel' && !toE164(inp.value)) valid = false;
      if (inp.type !== 'checkbox') inp.parentNode.classList.toggle('invalid', !valid);
      if (!valid) ok = false;
    });
    errBox.textContent = ERR_FIELDS;
    errBox.hidden = ok;
    if (!ok) return;

    var tel = toE164(form.telefon.value);
    var antworten = {};
    Object.keys(answers).forEach(function (k) { antworten[k] = answers[k]; });
    antworten.rechner = calc.modus;
    var res = null;
    try {
      res = ergebnis();
      var m = res.modell;
      antworten.zve_geschaetzt = Math.round(res.zvE);
      antworten.ergebnis_kaufpreis = Math.round(m.invest);
      antworten.ergebnis_cashflow_vor = Math.round(m.cashflowVorMonat);
      antworten.ergebnis_cashflow_nach = Math.round(m.cashflowNachMonat);
      antworten.ergebnis_steuer_kaufjahr = Math.round(m.steuerKaufjahr);
      antworten.ergebnis_steuer_laufend = Math.round(m.steuerLaufend);
      antworten.hinweis = res.hinweis || '';
    } catch (e) { track('calc_error', { error: String(e) }); }
    var payload = {
      vorname: form.vorname.value.trim(),
      nachname: form.nachname.value.trim(),
      email: form.email.value.trim(),
      telefon: tel,
      consent: true,
      antworten: antworten,
      funnel: 'bdx-objekt-kalkulation',
      seite: location.origin + location.pathname,
      tracking: params(),
      zeitpunkt: new Date().toISOString()
    };

    sending = true;
    submitBtn.disabled = true;
    var label = submitBtn.textContent;
    submitBtn.textContent = 'Wird gesendet …';
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 15000);

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + WEBHOOK_TOKEN },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) throw new Error('HTTP ' + res.status);
      track('lead_submit', { status: res.status });
      var lead = { vorname: payload.vorname, nachname: payload.nachname, email: payload.email, telefon: payload.telefon };
      try {
        sessionStorage.setItem('bdx_lead', JSON.stringify(lead));
        sessionStorage.setItem('bdx_rechner', JSON.stringify({ modus: calc.modus, lead: lead,
          A: { beruf: calc.beruf, verheiratet: !!calc.verheiratet, einkommenArt: 'brutto', einkommen: calc.einkommen, ks: 0,
               eigenkapital: calc.eigenkapital, budget: calc.budget, invest: calc.invest } }));
      } catch (e) {}
      var hi = document.getElementById('danke-name');
      if (hi) hi.textContent = payload.vorname ? payload.vorname + ', hier ist' : 'Hier ist';
      history.replaceState({ s: 'danke' }, '', '#danke');
      show('danke', false);
      document.dispatchEvent(new CustomEvent('bdx:danke', { detail: { modus: calc.modus } }));
    }).catch(function (e) {
      track('lead_submit_error', { error: String(e) });
      errBox.textContent = 'Das Senden hat leider nicht geklappt. Bitte versuche es in einem Moment erneut.';
      errBox.hidden = false;
    }).then(function () {
      clearTimeout(timer);
      sending = false;
      submitBtn.disabled = false;
      submitBtn.textContent = label;
    });
  });

  // Start: Deep-Links auf Zwischenschritte ohne Antworten starten vorne
  var initial = location.hash.slice(1);
  history.replaceState({ s: 'start' }, '', location.pathname + location.search);
  show(initial === 'start' ? 'start' : 'start', false);
})();
