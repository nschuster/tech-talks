# Web Tech Talks

Reveal.js-based presentation workspace. Each folder under `presentations/` is a standalone deck.

## Presentations

- [`presentations/cloud-orchestration-universal-kubernetes-control-plane`](presentations/cloud-orchestration-universal-kubernetes-control-plane/) — **Cloud Orchestration: with a Universal Kubernetes Control Plane**

## Quick start

```bash
npm install
npm run dev
```

Open the deck:

```text
http://localhost:5173/presentations/cloud-orchestration-universal-kubernetes-control-plane/
```

## Theme model

The deck uses a small CSS variable system in `css/theme.css`:

- switch default mode by changing `data-theme="dark"` to `data-theme="light"` on the `<html>` tag
- adjust light colors under `:root[data-theme="light"]`
- adjust dark colors under `:root[data-theme="dark"]`
- press **T** or click the theme button during the presentation to toggle light/dark mode

Each presentation can have its own `css/theme.css` so talk-specific branding stays isolated.
