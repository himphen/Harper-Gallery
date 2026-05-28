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
├── download-dummy-images.sh
├── index.html
├── main.js
├── style.css
└── artworks/
    ├── art1.jpg
    ├── art2.jpg
    ├── art3.jpg
    ├── art4.jpg
    ├── art5.jpg
    ├── art6.jpg
    ├── art7.jpg
    └── art8.jpg
```

## Download Dummy Images

The script downloads eight seeded placeholder JPG files into `artworks/`.

```bash
chmod +x download-dummy-images.sh
./download-dummy-images.sh
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

## Replace Dummy Images With Real Artwork

Use either approach:

1. Replace files in `artworks/` while keeping names `art1.jpg` to `art8.jpg`.
2. Keep your filenames and update `file` paths in the `artworks` array in `main.js`.

All paths must stay relative (for example: `artworks/my-drawing-01.jpg`).

## Edit Artwork Titles and Descriptions

In `main.js`, edit the `artworks` array:

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

- GitHub Pages is static hosting, so artwork metadata is manually maintained in `main.js`.
- Do not use absolute local file paths like `file:///Users/...`.
- `context/` is excluded by `.gitignore`.
- Agent instructions for Cursor or other AI coding assistants live in `AGENTS.md`.
