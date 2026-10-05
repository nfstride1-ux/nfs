# NFS Bricklaying — Front Page

Static marketing front page for **NFS Bricklaying** (Golden Bay / South of the River Perth).

**Slogan:** Built with Pride  
**Phone:** 0408 941 768

## Files

| File | Purpose |
|------|---------|
| `index.html` | Page structure: sticky nav, hero, trust strip, services, about, contact form, footer |
| `styles.css` | Mobile-first cinematic dark UI (CSS glow only, no frameworks) |
| `script.js` | Mobile nav toggle, year stamp, mailto + alert contact form |
| `open.bat` | Windows helper to open `index.html` in the default browser |

## Colours

- Background: `#05070b` / `#0b0f16`
- Accent cyan: `#00b4ff` / `#3de0ff`
- Brick red: `#c23b2a`
- Sunset gold: `#ff8a3d` (sparingly)
- Text: `#e8eef7`

## Local preview

- **Windows:** double-click `open.bat`, or open `index.html` in a browser.
- **Any OS:** open `index.html` directly, or serve the folder with any static server.

No build step. No heavy frameworks. Google Fonts (Inter + Orbitron) load from the CDN when online.

## Contact form

The form builds a `mailto:` link (placeholder address `enquiries@nfsbricklaying.example`) and shows a confirmation alert. Replace the mailto address in `script.js` when a real inbox is ready.
