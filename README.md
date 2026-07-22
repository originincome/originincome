# Origin Income V5 — Command Menu & AI Workspace

Enthalten:
- Full-screen Origin Command Menu
- Product-, Company- und Legal-Navigation
- AI Workspace mit Businessplan, Pitch Deck, AGB, Datenschutz, Impressum, Offerten, Verträgen und Rechnungen
- Premium Coming-soon-Modals
- Pricing-Preview
- About-Bereich
- interaktive FAQ
- Kontaktbereich
- bestehende V4-Landingpage, Dashboard, Countdown und Onboarding

## Deployment
Den kompletten Inhalt dieses Ordners in das bestehende GitHub-Repository hochladen und committen. Vercel startet danach automatisch ein Deployment.

## Kontaktformular aktivieren
Das Formular sendet alle Anfragen direkt an `hello@originincome.com` und setzt die Absenderadresse als Reply-To.

1. Kostenloses Konto bei Resend erstellen und `originincome.com` als Versanddomain verifizieren.
2. In Vercel unter **Project → Settings → Environment Variables** hinzufügen:
   - `RESEND_API_KEY` = dein Resend API Key
   - `CONTACT_FROM_EMAIL` = `Origin Income Website <contact@originincome.com>`
3. Neu deployen.

Die sichtbaren Alias-Adressen bleiben zusätzlich direkt anklickbar:
`hello@`, `support@`, `billing@` und `privacy@originincome.com`.
