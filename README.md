# Tech Talks

Reveal.js-based presentation workspace. Each top-level folder is a standalone, self-contained deck with its own `package.json`.

## Presentations

- [`cloud-orchestration-universal-kubernetes-control-plane`](cloud-orchestration-universal-kubernetes-control-plane/) — **Cloud Orchestration: with a Universal Kubernetes Control Plane**

## Start a presentation

```bash
cd cloud-orchestration-universal-kubernetes-control-plane
npm install
npm run dev
```

Open the deck:

```text
http://localhost:5173/
```

## Validate all decks from the repository root

```bash
node scripts/validate-presentations.mjs
```

## Theme model

Each deck owns its own theme in `css/theme.css`:

- switch default mode by changing `data-theme="dark"` to `data-theme="light"` on the `<html>` tag
- adjust light colors under `:root[data-theme="light"]`
- adjust dark colors under `:root[data-theme="dark"]`
- press **T** or click the theme button during the presentation to toggle light/dark mode

Keeping dependencies and theme files inside each presentation makes decks easier to copy, archive, or publish independently.
