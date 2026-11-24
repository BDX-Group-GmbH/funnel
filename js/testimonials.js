/* BDX Testimonials · Landing (#testimonials-start) und Ergebnisseite (#testimonials-danke).
   Texte: Dokument „BDX Testimonial-Skripte – Problem, Lösung, Resultat“ (09.11.2026).
   Seit 18.11.2026 nur Leon, Celina, Faruk (echte Fotos von BDX, img/testimonials/). Victor, Carsten, Paul entfernt. */
(function () {
  'use strict';

  var T = [
    { id: 'leon', name: 'Leon', rolle: 'Inhaber von Viktilabs', modus: 'cashflow',
      zahl: 'rund 70.000 €', zahlLabel: 'steuerlich abgesetzt', fakt: 'Jeden Monat rund 100 € übrig',
      zitat: 'Rund 70.000 Euro konnte ich steuerlich absetzen. Und jeden Monat bleiben mir rund 100 Euro übrig.',
      problem: 'Ich wollte in eine Immobilie investieren, aber keine, die mich jeden Monat Geld kostet. Viele Angebote, die ich gesehen habe, waren nur mit Zuschuss tragbar.',
      loesung: 'BDX hat mir eine sanierte Wohnung vorgestellt, bei der die Rechnung von Anfang an aufging. Miete, Finanzierung und Steuer, alles zusammen gerechnet.',
      zusammenarbeit: 'Die Zahlen, die mir am Anfang gezeigt wurden, sind auch die, die heute auf meinem Konto ankommen. Das ist für mich das Wichtigste.' },
    { id: 'celina', name: 'Celina', rolle: 'Teamlead bei Enpal', modus: 'cashflow',
      zahl: 'rund 50.000 €', zahlLabel: 'steuerlich abgesetzt', fakt: 'Erste Kapitalanlage, trägt sich vor Steuern',
      zitat: 'Rund 50.000 Euro konnte ich steuerlich absetzen. Und die Wohnung trägt sich schon vor Steuern selbst.',
      problem: 'Das war meine erste Kapitalanlage. Ich hatte viele Fragen und ehrlich gesagt auch Respekt davor, etwas falsch zu machen.',
      loesung: 'BDX hat mir eine Wohnung in Berlin gezeigt, die Sanierung umgesetzt und mich durch jeden Schritt begleitet, vom Kauf bis zur Vermietung.',
      zusammenarbeit: 'Ich wusste immer, wo mein Projekt steht. Bei jeder Frage hatte ich direkt jemanden, der es wirklich kennt. Gerade beim ersten Mal ist das Gold wert.' },
    { id: 'faruk', name: 'Faruk', rolle: 'Teamlead bei Enpal', modus: 'kaufpreis',
      zahl: 'rund 30.000 €', zahlLabel: 'steuerlich abgesetzt', fakt: 'Als Angestellter, Wohnung trägt sich selbst',
      zitat: 'Rund 30.000 Euro steuerlich abgesetzt, und die Wohnung trägt sich selbst. Schon mit einer Wohnung hat sich das für mich deutlich bemerkbar gemacht.',
      problem: 'Ich dachte lange, so etwas lohnt sich nur für Leute mit sehr hohem Einkommen. Für mich als Angestellten schien das weit weg.',
      loesung: 'Dann habe ich mit BDX eine Wohnung in Moabit gekauft, saniert und vermietet. Alles aus einer Hand, ohne dass ich mich um die Baustelle kümmern musste.',
      zusammenarbeit: 'Ich war mit dem Service so zufrieden, dass ich BDX direkt an Kollegen und Freunde weiterempfohlen habe. Ehrliche Beratung, auch bei den unangenehmen Fragen. Genau deshalb habe ich Vertrauen gefasst.',
      offenlegung: 'Faruk hat BDX weiterempfohlen und dafür eine Provision erhalten.' }
  ];

  var DISCLAIMER = 'Einzelfälle. Steuerliche Wirkung abhängig von persönlicher Situation. Keine Steuer- oder Anlageberatung, keine Garantie.';
  var SICHTBAR = 3;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function card(t, i) {
    return '<article class="tm-card' + (i >= SICHTBAR ? ' tm-more' : '') + '"' + (i >= SICHTBAR ? ' hidden' : '') + '>' +
      '<header class="tm-head"><img src="img/testimonials/' + t.id + '.jpg" width="112" height="112" alt="' + esc(t.name) + ', ' + esc(t.rolle) + '" loading="lazy">' +
      '<div><strong class="tm-name">' + esc(t.name) + '</strong><span class="tm-rolle">' + esc(t.rolle) + '</span></div></header>' +
      '<div class="tm-zahl"><b>' + esc(t.zahl) + '</b> ' + esc(t.zahlLabel) + '<span>' + esc(t.fakt) + '</span></div>' +
      '<blockquote class="tm-zitat">„' + esc(t.zitat) + '“</blockquote>' +
      '<details class="tm-story"><summary>Ganze Geschichte lesen</summary>' +
        '<p><b>Vorher:</b> ' + esc(t.problem) + '</p>' +
        '<p><b>Mit BDX:</b> ' + esc(t.loesung) + '</p>' +
        '<p><b>Zusammenarbeit:</b> ' + esc(t.zusammenarbeit) + '</p></details>' +
      (t.offenlegung ? '<p class="tm-offen">' + esc(t.offenlegung) + '</p>' : '') +
      '</article>';
  }

  function render(host, liste) {
    if (!host) return;
    var mehr = liste.length > SICHTBAR;
    host.innerHTML = '<div class="tm-grid">' + liste.map(card).join('') + '</div>' +
      (mehr ? '<button type="button" class="tm-toggle">Weitere Erfahrungen anzeigen</button>' : '') +
      '<p class="tm-disclaimer">' + esc(DISCLAIMER) + '</p>';
    var btn = host.querySelector('.tm-toggle');
    if (btn) btn.addEventListener('click', function () {
      Array.prototype.forEach.call(host.querySelectorAll('.tm-more'), function (el) { el.hidden = false; });
      btn.remove();
    });
  }

  // Ergebnisseite: passende Erfahrungen zum Rechnerpfad zuerst
  function sortiert(modus) {
    return T.filter(function (t) { return t.modus === modus; }).concat(T.filter(function (t) { return t.modus !== modus; }));
  }

  render(document.getElementById('testimonials-start'), T);
  render(document.getElementById('testimonials-danke'), T);
  document.addEventListener('bdx:danke', function (ev) {
    var m = ev.detail && ev.detail.modus;
    render(document.getElementById('testimonials-danke'), m ? sortiert(m) : T);
  });

  window.BDX_TESTIMONIALS = T;
})();
