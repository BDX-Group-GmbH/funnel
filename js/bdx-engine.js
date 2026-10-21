/* BDX Rechen-Engine + Musterobjekt (Steuerjahr 2026)
   Gemeinsam genutzt von js/funnel.js (Ergebnis im Funnel) und rechner/index.html (Einzel-Rechner).
   Werte des Musterobjekts nur hier ändern. */
var BDX_DEFAULTS = {
  // Musterobjekt (Durchschnitt BDX)
  referenzPreis: 280000,             // Kaufpreis Musterwohnung (ohne Sanierung)
  sanierungAufKaufpreis: 0.25,       // Sanierung zusätzlich in % vom Kaufpreis (Erhaltungsaufwand), z. B. 400k -> 100k
  mietrendite: 1500 * 12 / 350000,   // Kaltmiete/Jahr zu Gesamtinvest (Kaufpreis + Sanierung)
  mietausfall: 0.02,
  verwaltungJahr: 420,               // nicht umlagefähig, steuerlich absetzbar (je Referenzobjekt)
  ruecklageJahr: 540,                // Instandhaltungsrücklage (Liquidität, nicht absetzbar)
  grunderwerbsteuer: 0.06,           // Berlin, nur auf Kaufpreis
  notarGrundbuch: 0.02,
  gebaeudeAnteil: 0.75,
  afaSatz: 0.04,                     // AfA auf Gebäudeanteil (BDX-Standard 4 %)

  // Finanzierung
  eigenkapitalQuote: 0.10,
  finanzierungsNebenkosten: 0.005,
  zins: 0.038,
  tilgung: 0.015,

  // Kaufpreis-Rechner
  preisMin: 160000,                  // Kaufpreis ohne Sanierung
  preisMax: 480000,
  liquiditaetsPuffer: 10000,         // muss nach EK-Einsatz übrig bleiben
  maxSanierungJeZvE: 1.0,            // Sanierung max. so hoch wie zvE
  maxRateAnteil: 0.35,               // Rate max. 35 % des monatl. zvE
  mindestZvE: 80000                  // darunter: Hinweis "Steuereffekt eher gering"
};

/* ===== BDX Rechen-Engine (Steuerjahr 2026) ===== */
var BDX = (function () {
  // Einkommensteuer Grundtarif § 32a Abs. 1 EStG, VZ 2026
  function estGrund(zvE) {
    var x = Math.floor(Math.max(0, zvE));
    var t;
    if (x <= 12348) t = 0;
    else if (x <= 17799) { var y = (x - 12348) / 10000; t = (914.51 * y + 1400) * y; }
    else if (x <= 69878) { var z = (x - 17799) / 10000; t = (173.10 * z + 2397) * z + 1034.87; }
    else if (x <= 277825) t = 0.42 * x - 11135.63;
    else t = 0.45 * x - 19470.38;
    return Math.floor(t);
  }
  // Splitting § 32a Abs. 5 EStG
  function est(zvE, verheiratet) {
    return verheiratet ? 2 * estGrund(Math.floor(Math.max(0, zvE) / 2)) : estGrund(zvE);
  }
  // Solidaritätszuschlag 2026: Freigrenze 20.350 € / 40.700 €, Milderungszone 11,9 %
  function soli(estBetrag, verheiratet) {
    var fg = verheiratet ? 40700 : 20350;
    if (estBetrag <= fg) return 0;
    return Math.floor(Math.min(0.055 * estBetrag, 0.119 * (estBetrag - fg)) * 100) / 100;
  }
  function steuerGesamt(zvE, verheiratet, kirchensteuerSatz) {
    var e = est(zvE, verheiratet);
    return e + soli(e, verheiratet) + e * (kirchensteuerSatz || 0);
  }
  // Ersparnis (positiv) bzw. Mehrsteuer (negativ) durch Ergebnis V+V
  function steuerWirkung(zvE, vuv, verheiratet, ks) {
    return steuerGesamt(zvE, verheiratet, ks) - steuerGesamt(Math.max(0, zvE + vuv), verheiratet, ks);
  }
  // grobe Schätzung zvE aus Brutto. Angestellte/Selbstständige: Vorsorgeaufwand ca. 12 % (max. 20.000 €).
  // Beamte zahlen keine Renten-/Arbeitslosenversicherung: nur ca. 5 % (max. 8.000 €) für die Krankenversicherung.
  function zvEausBrutto(brutto, beruf) {
    var beamter = /beamt/i.test(beruf || "");
    var vorsorge = beamter ? Math.min(brutto * 0.05, 8000) : Math.min(brutto * 0.12, 20000);
    return Math.max(0, brutto - vorsorge - 1230);
  }

  // Zinsen je Jahr bei Annuitätendarlehen (monatliche Raten)
  function zinsenJeJahr(darlehen, zins, tilgung, jahre) {
    var rate = darlehen * (zins + tilgung) / 12, rest = darlehen, out = [];
    for (var j = 0; j < jahre; j++) {
      var z = 0;
      for (var m = 0; m < 12; m++) { var zm = rest * zins / 12; z += zm; rest -= (rate - zm); }
      out.push(z);
    }
    return out;
  }

  // Kernmodell: p.invest = Kaufpreis der Wohnung; Sanierung kommt zusätzlich obendrauf
  function modell(C, p) {
    var invest = p.invest;
    var kauf = invest;
    var sanierung = kauf * C.sanierungAufKaufpreis;
    var gesamt = kauf + sanierung;
    var kaufNK = kauf * (C.grunderwerbsteuer + C.notarGrundbuch);
    var ek = Math.max(kauf * C.eigenkapitalQuote, p.ekEinsatz || 0);
    var darlehenRoh = Math.max(0, gesamt + kaufNK - ek);
    var finNK = darlehenRoh * C.finanzierungsNebenkosten;
    var darlehen = darlehenRoh + finNK;
    var mieteJahr = gesamt * C.mietrendite;
    var mieteNetto = mieteJahr * (1 - C.mietausfall);
    var f = invest / C.referenzPreis;
    var verwaltung = C.verwaltungJahr * f;
    var ruecklage = C.ruecklageJahr * f;
    var annuitaet = darlehen * (C.zins + C.tilgung);
    var zinsen = zinsenJeJahr(darlehen, C.zins, C.tilgung, 2);
    var afa = (kauf + kaufNK) * C.gebaeudeAnteil * C.afaSatz;

    var vuv1 = mieteNetto - verwaltung - zinsen[0] - afa - sanierung - finNK;
    var vuv2 = mieteNetto - verwaltung - zinsen[1] - afa;
    var st1 = steuerWirkung(p.zvE, vuv1, p.verheiratet, p.ks);
    var st2 = steuerWirkung(p.zvE, vuv2, p.verheiratet, p.ks);

    var cfVorJahr = mieteNetto - verwaltung - ruecklage - annuitaet;
    return {
      invest: invest, kaufpreis: kauf, sanierung: sanierung, gesamt: gesamt, kaufNebenkosten: kaufNK,
      eigenkapital: ek, darlehen: darlehen, mieteMonat: mieteJahr / 12,
      rateMonat: annuitaet / 12, afaJahr: afa,
      vuvJahr1: vuv1, vuvLaufend: vuv2,
      steuerKaufjahr: st1, steuerLaufend: st2,
      cashflowVorMonat: cfVorJahr / 12,
      cashflowNachMonat: (cfVorJahr + st2) / 12
    };
  }

  // höchster passender Gesamtinvest
  // Ergebnis: { modell, hinweis } – hinweis: null | "mehrEK" | "budget" | "eigenkapital" | "einkommen"
  function passenderPreis(C, p) {
    var verfuegbar = Math.max(0, p.eigenkapital - C.liquiditaetsPuffer);
    var best = null, bestHinweis = null, guenstigste = null;
    for (var inv = C.preisMin; inv <= C.preisMax; inv += 5000) {
      var basis = { invest: inv, zvE: p.zvE, verheiratet: p.verheiratet, ks: p.ks };
      var m = modell(C, basis);
      // Sanierung soll vom Einkommen im Kaufjahr aufgefangen werden; grobe Bankgrenze
      if (m.sanierung > p.zvE * C.maxSanierungJeZvE) continue;
      if (verfuegbar < m.eigenkapital) continue;
      var hinweis = null;
      if (-m.cashflowNachMonat > p.budgetMonat) {
        // mit mehr Eigenkapital rechnen, um das Monatsbudget zu treffen
        var mMehr = modell(C, Object.assign({ ekEinsatz: verfuegbar }, basis));
        if (-mMehr.cashflowNachMonat <= p.budgetMonat) {
          // nur so viel EK wie nötig: binäre Suche
          var lo = m.eigenkapital, hi = verfuegbar;
          for (var i = 0; i < 25; i++) {
            var mid = (lo + hi) / 2;
            if (-modell(C, Object.assign({ ekEinsatz: mid }, basis)).cashflowNachMonat <= p.budgetMonat) hi = mid; else lo = mid;
          }
          m = modell(C, Object.assign({ ekEinsatz: Math.ceil(hi / 1000) * 1000 }, basis));
          hinweis = "mehrEK";
        } else {
          if (!guenstigste || -mMehr.cashflowNachMonat < -guenstigste.cashflowNachMonat) guenstigste = mMehr;
          continue;
        }
      }
      if (m.rateMonat > (p.zvE / 12) * C.maxRateAnteil) continue;
      best = m; bestHinweis = hinweis;
    }
    if (best) return { modell: best, hinweis: bestHinweis };
    if (guenstigste) return { modell: guenstigste, hinweis: "budget" };
    // weiche Absagen: Einstiegsobjekt zeigen
    var einstieg = modell(C, { invest: C.preisMin, zvE: p.zvE, verheiratet: p.verheiratet, ks: p.ks });
    if (einstieg.sanierung > p.zvE * C.maxSanierungJeZvE) return { modell: einstieg, hinweis: "einkommen" };
    return { modell: einstieg, hinweis: "eigenkapital" };
  }

  return { est: est, soli: soli, steuerGesamt: steuerGesamt, steuerWirkung: steuerWirkung,
           zvEausBrutto: zvEausBrutto, modell: modell, passenderPreis: passenderPreis };
})();
if (typeof module !== 'undefined') module.exports = BDX;
