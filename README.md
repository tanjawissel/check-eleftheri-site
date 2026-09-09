# check.eleftheri.com — „Der Freiheits-Check"

Statische Landingpage (Lead-Magnet) für ELEFTHERI. Kein Framework, kein Build-Schritt.
Wird über **GitHub Pages** ausgeliefert und läuft unter der Subdomain
`check.eleftheri.com` (DNS bei cyon.ch).

## Struktur

| Datei / Ordner | Zweck |
| --- | --- |
| `index.html` | die komplette Seite |
| `styles.css` | Styles |
| `script.js` | Formular-Validierung, Scroll-/Reveal-Effekte, Erfolgsmeldung |
| `fonts/` | lokal eingebundene Schriften (Cormorant Garamond, Lato) — kein Google-CDN |
| `CNAME` | Custom Domain für GitHub Pages (`check.eleftheri.com`) |
| `.nojekyll` | schaltet die Jekyll-Verarbeitung auf GitHub Pages ab |

Nicht im Repo (siehe `.gitignore`): `Freiheits-Check.pdf` und
`Freiheits-Check_druckvorlage.html` — das PDF wird per Brevo-E-Mail nach
Double-Opt-In ausgeliefert, nicht öffentlich verlinkt.

## Formular / Newsletter

Das Anmeldeformular postet direkt an ein Brevo-gehostetes Formular
(`*.sibforms.com`) in ein verstecktes `<iframe>`. Kein API-Key im Code.
Double-Opt-In muss in den Brevo-Formulareinstellungen aktiv sein.

## Änderungen veröffentlichen

```bash
git add -A
git commit -m "Beschreibung der Änderung"
git push
```

GitHub Pages baut nach dem Push automatisch neu (ca. 1 Minute).

## Deployment

- **Repo:** `tanjawissel/check-eleftheri-site`
- **Branch/Ordner:** `main` / Projektwurzel (`/`)
- **Custom Domain:** `check.eleftheri.com`, HTTPS erzwungen
