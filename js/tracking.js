/* BDX Tracking-Events: Meta Pixel (2339330703558356) + PostHog (EU).
   Basis-Snippets stehen im <head> von index.html. Hier nur die Funnel-Events.
   - Meta: PageView einmal pro Aufruf (Fragen-Wechsel per pushState lösen kein weiteres PageView aus),
           Lead nach erfolgreichem Formular (HTTP 2xx), Schedule nach gebuchtem Calendly-Termin.
   - PostHog: funnel_screen je Schritt, funnel_answer (nur unkritische Fragen, keine Einkommens-/Eigenkapitalwerte),
              lead_submitted, termin_gebucht. Keine Namen, E-Mails oder Telefonnummern an Meta oder PostHog. */
(function () {
  'use strict';
  var SICHERE_ANTWORTEN = { ziel: 1, beruf: 1, veranlagung: 1, prioritaet: 1 };

  function ph(name, props) { try { if (window.posthog && window.posthog.capture) window.posthog.capture(name, props || {}); } catch (e) {} }
  function fb(type, name, props) { try { if (window.fbq) window.fbq(type, name, props || {}); } catch (e) {} }

  // Brücke vom Funnel-Log (js/funnel.js -> window.BDX_TRACK)
  window.BDX_TRACK = function (name, d) {
    d = d || {};
    if (name === 'screen_view') ph('funnel_screen', { screen: d.screen });
    else if (name === 'answer' && d.key) ph('funnel_answer', SICHERE_ANTWORTEN[d.key] && d.val ? { frage: d.key, antwort: d.val } : { frage: d.key });
    else if (name === 'lead_submit_error') ph('lead_submit_error', {});
  };

  document.addEventListener('bdx:danke', function (ev) {
    var modus = (ev.detail && ev.detail.modus) || '';
    fb('track', 'Lead', { content_name: 'BDX Objekt-Kalkulation', content_category: modus });
    ph('lead_submitted', { rechner: modus });
  });

  document.addEventListener('bdx:termin_gebucht', function () {
    fb('track', 'Schedule', { content_name: 'Termin Jarl 30min' });
    ph('termin_gebucht', {});
  });
})();
