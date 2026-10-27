/* Calendly Pop-up für den Button "Termin mit Jarl anfragen" (#cta-termin).
   - Lädt Calendly erst beim Klick (keine Drittanbieter-Requests vorher).
   - Übergibt Name + E-Mail aus dem Kontaktformular und UTM-Parameter.
   - Ist CALENDLY_URL leer, bleibt der Button ein mailto-Link (Fallback). */
(function () {
  var CALENDLY_URL = ''; // z. B. 'https://calendly.com/jarl-bdx/15min'

  var btn = document.getElementById('cta-termin');
  if (!btn || !CALENDLY_URL) return;

  var loading = null;
  function loadCalendly() {
    if (window.Calendly && window.Calendly.initPopupWidget) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (resolve, reject) {
      var css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(css);
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
    var f = document.querySelector('form input[name="email"]');
    f = f ? f.form : null;
    if (!f) return {};
    var p = {};
    var vn = f.vorname ? f.vorname.value.trim() : '';
    var nn = f.nachname ? f.nachname.value.trim() : '';
    if (vn || nn) p.name = (vn + ' ' + nn).trim();
    if (f.email && f.email.value.trim()) p.email = f.email.value.trim();
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

  var mailto = btn.getAttribute('href');
  btn.setAttribute('href', CALENDLY_URL);
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    if (window.BDX_EVENTS) window.BDX_EVENTS.push({ e: 'termin_click', d: {}, t: Date.now() });
    loadCalendly().then(function () {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL, prefill: prefill(), utm: utm() });
    }, function () {
      window.open(CALENDLY_URL, '_blank', 'noopener') || (location.href = mailto);
    });
  });

  // Gebuchter Termin -> Event für Tracking (Pixel/PostHog können darauf hören)
  window.addEventListener('message', function (e) {
    if (e.origin === 'https://calendly.com' && e.data && e.data.event === 'calendly.event_scheduled') {
      if (window.BDX_EVENTS) window.BDX_EVENTS.push({ e: 'termin_gebucht', d: {}, t: Date.now() });
      document.dispatchEvent(new CustomEvent('bdx:termin_gebucht'));
    }
  });
})();
