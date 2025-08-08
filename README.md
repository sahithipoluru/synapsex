# SynapseX Static Site

Single-page static marketing / overview site for **SynapseX**: a self-learning autonomous AI platform for end-to-end market analysis, high-accuracy trade signal generation, and adaptive execution.

## Features
- Responsive, modern layout (no frameworks, pure HTML/CSS/JS)
- Light / dark theme toggle (persisted)
- Accessible, semantic structure
- No external network dependencies (fonts, CDNs, analytics, etc.)
- Animated hero visualization (canvas spark lines) respecting reduced motion preferences
- Simulated live metric counters (pure front-end, no backend)

## File Structure
```
index.html
assets/
  styles.css
  app.js
README.md
```

## Local Preview
Open `index.html` directly in a browser or (recommended) serve with a lightweight local server for proper caching & navigation:

### PowerShell (built-in)
```powershell
# From repo root
Start-Process "http://localhost:8080"; python -m http.server 8080
```
(Requires Python; alternatively use any static server you prefer.)

## Deploy to GitHub Pages
1. Commit files to your repository (e.g., `main` branch).
2. In GitHub repo settings > Pages:
   - Source: Deploy from a branch
   - Branch: `main` (or chosen) / root (`/`)
3. Save. After a short build, site will be live at `https://<user>.github.io/<repo>/`.

If using a docs folder strategy, move files into `docs/` and set Pages source to that folder.

## Customization
- Update meta description in `index.html` for SEO.
- Adjust color tokens or radii in `assets/styles.css` under `:root`.
- Add or remove feature cards, flow steps, or metrics in HTML only (minimal JS coupling).

## License
Content & code provided for internal / promotional use of SynapseX. Adapt as needed.

git commit -m "Your commit message"
