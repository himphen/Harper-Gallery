# AGENTS Guide

This file defines operating rules for Cursor or other AI coding agents working in this repository.

## Project Intent

Build and maintain a warm, professional 3D virtual art gallery for showcasing family artwork.

The experience should feel like a private gallery or museum exhibition, not a game or cartoon scene.

## Technical Constraints (Do Not Violate)

- Use plain `HTML`, `CSS`, and `JavaScript` only.
- Do not introduce React, TypeScript, npm, or build tools.
- Keep the project static-hosting compatible (GitHub Pages).
- Use Three.js via ES module CDN imports.
- Use relative paths for all assets.
- Do not add backend services, environment variables, or databases.

## Repository Rules

- Keep `context/` out of version control.
- Keep code readable and small-file friendly.
- Favor simple geometry and browser performance.
- Handle missing texture/image files with graceful visual fallback.
- Do not hardcode local absolute paths.

## Working Agreement for Agents

When making changes:

1. Preserve static compatibility.
2. Avoid adding dependencies that require installation/build steps.
3. Keep the `artworks` array in `main.js` easy to edit.
4. Keep interaction UX clear (orbit controls, click-to-view details, close action).
5. Update `README.md` whenever setup steps or structure changes.

## Done Criteria

A change is complete when:

- Project still runs with `python3 -m http.server 8000`.
- Paths are relative and GitHub Pages-safe.
- Core files remain understandable for non-expert maintainers.
- Instructions in `README.md` stay accurate.
