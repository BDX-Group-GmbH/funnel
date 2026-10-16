# BDX Group – Lead-Funnel „Die BDX Objekt-Kalkulation“ (v1)

Testseite: `https://tests.db3-cmo.io/bdx-objekt-kalkulation/` (noindex, kein Tracking, Formular sendet nichts).

Aufbau 1:1 nach dem capacura-Funnel `info.capacura.de/termin-v2/` (Landing mit Lead-Magnet → 7 Fragen als 2×2-Kacheln → Kontaktformular → Danke mit Terminangebot). CI nach `bdx-group.de`: Blau `#001EFF`, Schwarz `#141414`, Plus Jakarta Sans 800 (selbst gehostet), weiße Karten mit 1px-Rand, dunkle Sektion für die 10 Qualitätsdimensionen.

## Dateien
- `index.html`: Landing, Kontakt- und Danke-Screen (Copy hier bearbeiten).
- `js/funnel.js`: Fragen und Antworten (`QUESTIONS`), Icons (`ICONS`), Ablauf, Validierung, lokales Event-Log `window.BDX_EVENTS`.
- `css/style.css`: Design, Farben als CSS-Variablen oben.
- `fonts/`: Plus Jakarta Sans (Variable, OFL), latin + latin-ext.
- `img/`: Berlin-Luftbild und Wohnungsfoto von bdx-group.de (webp-Derivate).

Lokale Vorschau: `python3 -m http.server 8080` in diesem Ordner, dann `http://localhost:8080/`. Kein Build, kein Backend.

## Ablauf
1. Landing: „Echte Objektrechnung · Kostenlos“, „DIE BDX OBJEKT-KALKULATION“, 3 Nutzenpunkte, CTA, Hinweiszeile; darunter Berlin-Luftbild, Key-Facts (von bdx-group.de), Neubau-im-Bestand-Prinzip mit 10 Qualitätsdimensionen (von bdx-group.de), zweiter CTA.
2. Fragen 1–7: Ziel, Beruf, Bruttoeinkommen, Eigenkapital, Erfahrung, Kaufzeitpunkt, Priorität. Klick springt direkt weiter, Zurück per Button oder Browser.
3. Kontakt: Vorname, Nachname, E-Mail, Telefon, Datenschutz-Checkbox (Pflicht, clientseitig validiert).
4. Danke: 3 Schritte, Terminangebot mit Jarl (aktuell mailto an jarl@bdx-group.de).

## Quellen der Aussagen
- Key-Facts, 10 Qualitätsdimensionen, „unter Durchschnittspreis“, Adresse: bdx-group.de (gelesen 15.10.2026).
- Jarl Beger als Geschäftsführer: Impressum bdx-group.de.
- Zielgruppe/Qualifizierung (80k+, Eigenkapital, Kaufhorizont): BDX-Onboarding.

## Offen vor echtem Traffic
1. Kalkulations-PDF einer echten Wohnung erstellen (Lead-Magnet existiert noch nicht).
2. Formular an CRM (Pipedrive geplant) und E-Mail-Versand anbinden; Testbanner entfernen.
3. Datenschutzerklärung fehlt auf bdx-group.de; Link im Footer und an der Checkbox setzen.
4. Kalender-Tool für den Termin mit Jarl (statt mailto); optional VSL auf der Danke-Seite.
5. Echtes Logo-File von BDX (Website liefert nur Text-Wortmarke).
6. Steuerliche Aussagen fachlich freigeben lassen; Tracking (Pixel/CAPI) mit Consent ergänzen.
