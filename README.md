# BDX Group – Lead-Funnel „Die BDX Objekt-Kalkulation“ (v1)

Testseite: `https://tests.db3-cmo.io/bdx-objekt-kalkulation/` (noindex). Ziel-Hosting: `funnel.bdx-group.de` (ALL-INKL, Deploy per GitHub Actions, siehe `.github/workflows/deploy.yml`).

Aufbau 1:1 nach dem capacura-Funnel `info.capacura.de/termin-v2/` (Landing mit Lead-Magnet → 7 Fragen als 2×2-Kacheln → Kontaktformular → Danke mit Terminangebot). CI nach `bdx-group.de`: Blau `#001EFF`, Schwarz `#141414`, Plus Jakarta Sans 800 (selbst gehostet), weiße Karten mit 1px-Rand, dunkle Sektion für die 10 Qualitätsdimensionen.

## Dateien
- `index.html`: Landing, Kontakt- und Danke-Screen (Copy hier bearbeiten).
- `js/funnel.js`: Fragen und Antworten (`QUESTIONS`), Icons (`ICONS`), Ablauf, Validierung, lokales Event-Log `window.BDX_EVENTS`.
- `css/style.css`: Design, Farben als CSS-Variablen oben.
- `fonts/`: Plus Jakarta Sans (Variable, OFL), latin + latin-ext.
- `img/`: Berlin-Luftbild und Wohnungsfoto von bdx-group.de (webp-Derivate).

Lokale Vorschau: `python3 -m http.server 8080` in diesem Ordner, dann `http://localhost:8080/`. Kein Build, kein Backend.

## Rechner (Steuer · Cashflow · Kaufpreis)
- `rechner/index.html?modus=steuer|cashflow|kaufpreis`: ein Rechner für alle drei Modi (Rechen-Engine Steuerjahr 2026 unverändert aus den gelieferten Dateien, Annahmen im `CONFIG`-Block oben).
- Eingebettet auf der Danke-Seite (Sektion `#rechner`) als Tabs mit iframe; startet erst nach erfolgreichem Formularversand, Kontaktdaten kommen per sessionStorage `bdx_lead`, daher kein zweites Formular; Steuerung in `js/rechner-embed.js` (lädt jeden Rechner erst beim ersten Klick, Höhe per postMessage, nur gleiche Origin).
- Lead geht an denselben n8n-Webhook wie der Funnel, gleiche Feldstruktur; `funnel` = `bdx-rechner-<modus>`, Rechner-Eingaben und Ergebnisse stehen in `antworten`. Ergebnis erscheint erst nach HTTP 2xx, sonst Fehlermeldung.
- Schrift selbst gehostet (keine Google Fonts), CI-Blau `#001EFF`.

## Lead-Versand (n8n-Webhook)
Klick auf „Objekt-Kalkulation jetzt erhalten“ sendet per `POST` JSON an `https://n8n.srv1043875.hstgr.cloud/webhook/funnel-submit` mit Header `Authorization: Bearer <Token>` (URL und Token oben in `js/funnel.js`).
Felder: `vorname`, `nachname`, `email`, `telefon` (E.164, z. B. `+491701234567`; ohne Ländervorwahl gilt +49), `consent`, `antworten` (ziel, beruf, einkommen, eigenkapital, erfahrung, zeitraum, prioritaet), `funnel`, `seite`, `tracking` (utm_*, fbclid, gclid), `zeitpunkt`.
Danke-Seite erscheint nur bei HTTP 2xx, sonst Fehlermeldung am Formular (Lead geht nicht still verloren).
Voraussetzungen in n8n: Workflow aktiv, Webhook-Methode POST, CORS „Allowed Origins“ für die Funnel-Domains (Browser sendet Preflight wegen Authorization-Header).
Sicherheit: Der Token steht im Browser-Code und ist damit öffentlich lesbar. Er schützt nur vor zufälligen Aufrufen. In n8n Eingaben prüfen; besser später ein serverseitiger Proxy (PHP auf ALL-INKL), der den Token hält.

## Ablauf
Stand 21.10.2026 (nach Call 20.10.): 7 Fragen, Frage 1 ist die Weiche. Altersvorsorge -> Cashflow, Vermögen mit Sachwerten + Portfolio erweitern -> Passender Kaufpreis, Einkommensteuer senken -> Steuerersparnis. Frage 6 je Pfad: Kaufpreis-Regler (Steuer, Cashflow) oder Monatsbudget (Kaufpreis). Nach dem Formular zeigt die Danke-Seite genau diesen Rechner im Ergebnis-Modus (`rechner/?modus=…&ergebnis=1`, Daten aus sessionStorage `bdx_rechner`). Rechen-Engine und Musterobjekt: `js/bdx-engine.js`. Kirchensteuer wird nicht abgefragt (gerechnet ohne).

1. Landing: „Echte Objektrechnung · Kostenlos“, „DIE BDX OBJEKT-KALKULATION“, 3 Nutzenpunkte, CTA, Hinweiszeile; darunter Berlin-Luftbild, Key-Facts (von bdx-group.de), Neubau-im-Bestand-Prinzip mit 10 Qualitätsdimensionen (von bdx-group.de), zweiter CTA.
2. Fragen 1–7: Ziel, Beruf, Bruttoeinkommen, Eigenkapital, Erfahrung, Kaufzeitpunkt, Priorität. Klick springt direkt weiter, Zurück per Button oder Browser.
3. Kontakt: Vorname, Nachname, E-Mail, Telefon, Datenschutz-Checkbox (Pflicht, clientseitig validiert).
4. Danke: Ergebnis-Rechner, darunter Calendly Inline-Embed `calendly.com/jarl-bdx-group/30min` (js/calendly.js, lädt erst auf der Ergebnisseite, Name + E-Mail vorausgefüllt, mailto an Jarl als Fallback).

## Quellen der Aussagen
- Key-Facts, 10 Qualitätsdimensionen, „unter Durchschnittspreis“, Adresse: bdx-group.de (gelesen 15.10.2026).
- Jarl Beger als Geschäftsführer: Impressum bdx-group.de.
- Zielgruppe/Qualifizierung (80k+, Eigenkapital, Kaufhorizont): BDX-Onboarding.

## Tracking + Cookie-Banner (seit 17.11.2026)
- `js/consent.js`: Cookie-Banner („Alle akzeptieren“ / „Nur notwendige“ gleichwertig, „Einstellungen“ mit Statistik + Marketing). Meta Pixel `2339330703558356` (Marketing) und PostHog EU `phc_xtNu…` (Statistik) werden erst nach Einwilligung geladen, Original-Snippets stehen in `consent.js`. Ohne Einwilligung keine Requests an Meta/PostHog, auch kein noscript-Pixel.
- Auswahl in localStorage `bdx_consent` (6 Monate). Footer-Link „Cookie-Einstellungen“ öffnet den Banner erneut; Widerruf -> Opt-out + Reload. `DATENSCHUTZ_URL` in `consent.js` = https://bdx-group.de/datenschutz (auch Footer + Formular-Checkbox).
- `fbq.disablePushState = true`: Die Fragen wechseln per pushState, sonst käme pro Frage ein weiteres PageView.
- Events in `js/tracking.js` (feuern nur, wenn das jeweilige Tool geladen ist): Meta `Lead` nach erfolgreichem Formular, `Schedule` nach gebuchtem Calendly-Termin. PostHog: `funnel_screen`, `funnel_answer` (Antworttext nur für Ziel, Beruf, Veranlagung, Priorität), `lead_submitted`, `termin_gebucht`. Keine Namen, E-Mails, Telefonnummern an Meta/PostHog.
- PostHog-Dashboard: https://eu.posthog.com/project/303377/dashboard/1123837 (Org BDX Group, Projekt 303377).
- Calendly (Ergebnisseite) lädt weiterhin ohne Banner-Abfrage; setzt eigene Cookies.

## Testimonials (seit 17.11.2026)
- `js/testimonials.js`: 6 Kunden-Testimonials (Texte aus „BDX Testimonial-Skripte“, 09.11.2026) auf der Landing (`#testimonials-start`) und der Ergebnisseite (`#testimonials-danke`, passende Fälle zum Rechnerpfad zuerst). 3 sichtbar, Rest per „Weitere Erfahrungen anzeigen“. Disclaimer darunter, Provisions-Offenlegung bei Faruk.
- Seit 18.11.2026 nur noch Leon, Celina, Faruk mit echten Fotos von BDX (`img/testimonials/`, 240px-Ausschnitt). Victor, Carsten, Paul entfernt.
- Celina: Lage „Moabit“ durch „in Berlin“ ersetzt (Pascalstraße 2 liegt in Charlottenburg).
- Funnel-Payload enthält zusätzlich `ergebnis_sanierung`, `ergebnis_gesamt`, `ergebnis_eigenkapital`, `ergebnis_darlehen`, `ergebnis_miete_monat`, `ergebnis_rate_monat`, `ergebnis_tilgung_monat`, `ergebnis_afa_jahr`, seit 24.11. auch `ergebnis_kaufnebenkosten`, `ergebnis_vuv_kaufjahr`, `ergebnis_vuv_laufend` (für die Ergebnis-E-Mail). Bilder für die Mail als JPG unter `img/email/`.

## Offen vor echtem Traffic
1. Kalkulations-PDF einer echten Wohnung erstellen (Lead-Magnet existiert noch nicht).
2. n8n-Workflow aktivieren + CORS freigeben; Weiterleitung an CRM (Pipedrive geplant) und E-Mail-Versand.
3. Datenschutzerklärung fehlt auf bdx-group.de; Link im Footer und an der Checkbox setzen.
4. Calendly-Event auf Deutsch umbenennen und Slots einstellen (Jarl); optional VSL auf der Danke-Seite.
5. Echtes Logo-File von BDX (Website liefert nur Text-Wortmarke).
6. Steuerliche Aussagen fachlich freigeben lassen; Tracking (Pixel/CAPI) mit Consent ergänzen.
7. Schriftliche Freigabe von Leon, Celina, Faruk (Text, Name, Firma, Zahlen, Foto) ablegen; Fotonachweis Leon (© Rolf G. Wackenberg) klären.
8. Datenschutzerklärung auf bdx-group.de ist verlinkt, deckt den Funnel aber nicht ab (nennt keine Formulare, Cookies, Meta Pixel, PostHog, Calendly, n8n/Pipedrive). Ergänzen lassen.
