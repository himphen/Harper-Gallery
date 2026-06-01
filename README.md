# 3D Art Gallery

An elegant static 3D virtual gallery built with plain HTML, CSS, JavaScript, and Three.js ES module CDN imports.

This project is designed for:
- local development on macOS
- static deployment on GitHub Pages
- easy replacement of placeholder images with real family artworks

## File Structure

```text
gallery/
├── .gitignore
├── AGENTS.md
├── README.md
├── favicon.svg
├── index.html
├── artworks.js
├── main.js
├── style.css
└── artworks/
    ├── .gitkeep
    └── raw/
        └── .gitkeep
```

## Run Locally on macOS

1. Start a static server:

   ```bash
   python3 -m http.server 8000
   ```

2. Open:

   ```text
   http://localhost:8000
   ```

3. Controls:
   - Desktop: `WASD` or arrow keys to move, hold `Shift` to walk faster
   - Desktop: drag mouse to look around
   - Mobile/Tablet: drag to look around, pinch to zoom, use on-screen joystick to move
   - Tap/click artwork to open detail panel
   - Use top-right `Full Screen` button to enter or exit full screen mode

## Update Artwork Images

`artworks.js` is the single source of truth for gallery content.

For each artwork entry:

1. Put your image file in `artworks/` (for example: `artworks/art1.jpg`).
2. Set the `file` value in `artworks.js` to that relative path.

Notes:

- If an image file is missing, the frame shows a graceful placeholder texture instead of breaking.
- Keep paths relative for GitHub Pages compatibility (do not use absolute local paths).

## Edit Artwork Titles and Descriptions

In `artworks.js`, edit each item in the `artworks` array:

```js
{
  file: "artworks/art1.jpg",
  title: "Your Title",
  year: "2026",
  description: "Your description."
}
```

## Deploy to GitHub Pages

1. Create a GitHub repository.
2. Push this project to the repository.
3. Go to repository **Settings**.
4. Open **Pages**.
5. Set source to **Deploy from a branch**.
6. Select branch **main** and folder **/ (root)**.
7. Click **Save**.
8. Open the generated GitHub Pages URL.

## Important Notes

- GitHub Pages is static hosting, so artwork metadata is manually maintained in `artworks.js`.
- Do not use absolute local file paths like `file:///Users/...`.
- `context/` is excluded by `.gitignore`.
- Agent instructions for Cursor or other AI coding assistants live in `AGENTS.md`.
