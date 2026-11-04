/* Calendly Inline-Embed auf der Ergebnisseite (#calendly-termin), Code von Jarl:
   https://calendly.com/jarl-bdx-group/30min
   - Lädt Calendly erst, wenn die Ergebnisseite erscheint (Event bdx:danke). Vorher keine Drittanbieter-Requests.
   - Name + E-Mail aus dem Kontaktformular (sessionStorage bdx_lead) und UTM-Parameter werden übergeben.
   - Lädt Calendly nicht, bleibt der mailto-Link darunter als Fallback. */
(function () {
  'use strict';
  var box = document.getElementById('calendly-termin');
  if (!box) return;
  var URL_ = box.getAttribute('data-url');
  var loading = null, done = false;

  function loadCalendly() {
    if (window.Calendly && window.Calendly.initInlineWidget) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = resolve;
      s.onerror = function () { loading = null; reject(); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function prefill() {
    var l = {};
    try { l = JSON.parse(sessionStorage.getItem('bdx_lead') || '{}') || {}; } catch (e) {}
    var p = {}, name = ((l.vorname || '') + ' ' + (l.nachname || '')).trim();
    if (name) p.name = name;
    if (l.email) p.email = l.email;
    return p;
  }

  function utm() {
    var q = new URLSearchParams(location.search), o = {};
    [['utm_source', 'utmSource'], ['utm_medium', 'utmMedium'], ['utm_campaign', 'utmCampaign'],
     ['utm_content', 'utmContent'], ['utm_term', 'utmTerm']].forEach(function (k) {
      if (q.get(k[0])) o[k[1]] = q.get(k[0]);
    });
    return o;
  }

  document.addEventListener('bdx:danke', function () {
    if (done) return;
    loadCalendly().then(function () {
      done = true;
      box.innerHTML = '';
      window.Calendly.initInlineWidget({ url: URL_, parentElement: box, prefill: prefill(), utm: utm() });
    }, function () { box.style.display = 'none'; });
  });

  // Gebuchter Termin -> Event für Tracking (Pixel/PostHog können darauf hören)
  window.addEventListener('message', function (e) {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') {
      if (window.BDX_EVENTS) window.BDX_EVENTS.push({ e: 'termin_gebucht', d: {}, t: Date.now() });
      document.dispatchEvent(new CustomEvent('bdx:termin_gebucht'));
    }
  });
})();
