# 3D Art Gallery

A static, browser-based 3D art gallery built with plain HTML, CSS, JavaScript, and Three.js CDN modules.

This repository is set up as a lightweight foundation that runs locally on macOS and can be deployed to GitHub Pages.

## Current Project Structure

```text
gallery/
├── .gitignore
├── AGENTS.md
├── README.md
├── download-dummy-images.sh
├── index.html
├── main.js
├── style.css
├── artworks/
└── context/
```

## Quick Start (macOS)

1. Download placeholder images:

   ```bash
   chmod +x download-dummy-images.sh
   ./download-dummy-images.sh
   ```

2. Start a local static server:

   ```bash
   python3 -m http.server 8000
   ```

3. Open:

   ```text
   http://localhost:8000
   ```

## Replace With Real Artwork

- Keep the same filenames in `artworks/` (for example, `art1.jpg` ... `art8.jpg`), or
- Update each `file` path in the `artworks` array in `main.js`.

## Edit Artwork Metadata

In `main.js`, update the `artworks` array fields:

- `title`
- `year`
- `description`
- `file`

## GitHub Pages Deployment

1. Create a GitHub repository and push this folder.
2. Open repository **Settings**.
3. Go to **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` branch and `/ (root)` folder.
6. Save, then open the generated GitHub Pages URL.

## Notes

- This project is static-only: no backend, no database, no environment variables.
- `context/` is intentionally excluded from git via `.gitignore`.
- Agent guidance for Cursor/AI workflows is in `AGENTS.md`.
