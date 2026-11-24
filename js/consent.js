/* BDX Cookie-Banner + Consent-Steuerung (seit 17.11.2026)
   Meta Pixel (Marketing) und PostHog (Statistik) laden ERST nach Einwilligung.
   Ohne Entscheidung oder bei "Nur notwendige" gehen keine Requests an Meta oder PostHog.
   Gespeichert in localStorage "bdx_consent" ({v, statistik, marketing, t}), 6 Monate gültig.
   Footer-Link [data-consent-open] öffnet die Einstellungen erneut. Widerruf -> Opt-out + Reload.
   DATENSCHUTZ_URL = Datenschutzerklärung von bdx-group.de (Link im Banner). */
(function () {
  'use strict';
  var KEY = 'bdx_consent', VERSION = 1, MAX_AGE = 1000 * 60 * 60 * 24 * 180;
  var DATENSCHUTZ_URL = 'https://bdx-group.de/datenschutz';
  var META_PIXEL_ID = '2339330703558356';
  var loaded = { statistik: false, marketing: false };

  function lesen() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!c || c.v !== VERSION || (Date.now() - c.t) > MAX_AGE) return null;
      return c;
    } catch (e) { return null; }
  }
  function speichern(statistik, marketing) {
    var alt = lesen();
    var c = { v: VERSION, statistik: !!statistik, marketing: !!marketing, t: Date.now() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    // Widerruf einer bereits geladenen Einwilligung: abmelden und neu laden, damit nichts mehr läuft
    if (alt && ((alt.statistik && !c.statistik && loaded.statistik) || (alt.marketing && !c.marketing && loaded.marketing))) {
      try { if (!c.statistik && window.posthog && window.posthog.opt_out_capturing) window.posthog.opt_out_capturing(); } catch (e) {}
      try { if (!c.marketing && window.fbq) window.fbq('consent', 'revoke'); } catch (e) {}
      location.reload();
      return c;
    }
    anwenden(c);
    return c;
  }

  // ---- Meta Pixel Code (Original-Snippet, nur nach Einwilligung "Marketing") ----
  function ladeMeta() {
    if (loaded.marketing) return; loaded.marketing = true;
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};
    if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
    n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t,s)}(window, document,'script',
    'https://connect.facebook.net/en_US/fbevents.js');
    window.fbq.disablePushState = true; // Fragen-Wechsel per pushState sollen kein weiteres PageView auslösen
    window.fbq('init', META_PIXEL_ID);
    window.fbq('track', 'PageView');
  }

  // ---- PostHog (Original-Snippet, nur nach Einwilligung "Statistik") ----
  function ladePosthog() {
    if (loaded.statistik) return; loaded.statistik = true;
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}p||((p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",p.onerror=function(){p=null},(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r));var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],Object.defineProperty(u,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e}}),Object.defineProperty(u.people,"toString",{configurable:!0,enumerable:!0,writable:!0,value:function(){return u.toString(1)+".people (stub)"}}),o="Eh Rh Ph Oh Dh qh init yd bd dd fd Sd wc md xd ad Ed Ad Rd Pd Od Fd capture getExtension gr pd gd calculateEventProperties Dd register register_once register_for_session unregister unregister_for_session zd hd jd getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys onActiveMatchingSurveysChanged renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync Hd identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset Ud shutdown setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty qd Td createPersonProfile setInternalOrTestUser Bd Uh zh opt_in_capturing opt_out_capturing Hh has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing $d debug kc Ds getPageViewId captureTraceFeedback captureTraceMetric rd".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init('phc_xtNuUdrVLUbWEZYkZwRuq8YHPMv7M7S4ojpNEBp8Kueg', {
      api_host: 'https://eu.i.posthog.com',
      defaults: '2026-05-30',
      person_profiles: 'identified_only' // or 'always' to create profiles for anonymous users as well
    });
  }

  function anwenden(c) {
    if (c.statistik) ladePosthog();
    if (c.marketing) ladeMeta();
    document.dispatchEvent(new CustomEvent('bdx:consent', { detail: { statistik: c.statistik, marketing: c.marketing } }));
  }

  // ---- Banner ----
  var box = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (x) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[x]; }); }
  function banner(einstellungen) {
    if (box) box.remove();
    var c = lesen() || { statistik: false, marketing: false };
    box = document.createElement('div');
    box.className = 'cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'false');
    box.setAttribute('aria-labelledby', 'cc-title');
    // Inhalt ist statisch (keine Nutzereingaben), daher innerHTML unbedenklich
    box.innerHTML =
      '<div class="cc-in">' +
        '<p class="cc-title" id="cc-title">Cookies &amp; Datenschutz</p>' +
        '<p class="cc-text">Wir nutzen Cookies und ähnliche Technologien. <b>Statistik</b> (PostHog) zeigt uns, wie die Kalkulation genutzt wird, damit wir sie verbessern können. <b>Marketing</b> (Meta Pixel) misst, wie gut unsere Anzeigen funktionieren. Beides laden wir nur mit deiner Einwilligung. Du kannst sie jederzeit unten auf der Seite unter „Cookie-Einstellungen“ ändern.' +
        (DATENSCHUTZ_URL ? ' <a href="' + esc(DATENSCHUTZ_URL) + '" target="_blank" rel="noopener">Datenschutzerklärung</a>' : '') + '</p>' +
        '<div class="cc-opts"' + (einstellungen ? '' : ' hidden') + '>' +
          '<label class="cc-opt"><input type="checkbox" checked disabled><span><b>Notwendig</b> Speichert deine Auswahl und die Angaben für deine Auswertung. Immer aktiv.</span></label>' +
          '<label class="cc-opt"><input type="checkbox" id="cc-statistik"' + (c.statistik ? ' checked' : '') + '><span><b>Statistik</b> PostHog (EU-Server, Frankfurt): Seitenaufrufe, Klicks im Funnel, Sitzungsaufzeichnung ohne Formulareingaben.</span></label>' +
          '<label class="cc-opt"><input type="checkbox" id="cc-marketing"' + (c.marketing ? ' checked' : '') + '><span><b>Marketing</b> Meta Pixel (Meta Platforms Ireland): Messung unserer Anzeigen auf Facebook und Instagram.</span></label>' +
        '</div>' +
        '<div class="cc-btns">' +
          '<button type="button" class="cc-btn" data-cc="alle">Alle akzeptieren</button>' +
          '<button type="button" class="cc-btn" data-cc="notwendig">Nur notwendige</button>' +
          (einstellungen ? '<button type="button" class="cc-btn cc-ghost" data-cc="auswahl">Auswahl speichern</button>'
                         : '<button type="button" class="cc-btn cc-ghost" data-cc="einstellungen">Einstellungen</button>') +
        '</div>' +
      '</div>';
    document.body.appendChild(box);
    document.body.classList.add('cc-offen');
    box.addEventListener('click', function (ev) {
      var b = ev.target.closest('[data-cc]'); if (!b) return;
      var a = b.getAttribute('data-cc');
      if (a === 'einstellungen') { banner(true); return; }
      if (a === 'alle') speichern(true, true);
      else if (a === 'notwendig') speichern(false, false);
      else if (a === 'auswahl') speichern(document.getElementById('cc-statistik').checked, document.getElementById('cc-marketing').checked);
      schliessen();
    });
  }
  function schliessen() { if (box) { box.remove(); box = null; } document.body.classList.remove('cc-offen'); }

  document.addEventListener('click', function (ev) {
    var o = ev.target.closest('[data-consent-open]');
    if (o) { ev.preventDefault(); banner(true); }
  });

  window.BDX_CONSENT = { get: lesen, open: function () { banner(true); } };

  var start = lesen();
  if (start) anwenden(start);
  else if (document.body) banner(false);
  else document.addEventListener('DOMContentLoaded', function () { banner(false); });
})();
