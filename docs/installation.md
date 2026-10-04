# Installation

Install the package with npm:

```bash
npm install @norbert-fila/react-generative-visual
```

The package expects React 18 or newer as a peer dependency.

## Basic usage

```tsx
import { GenerativeVisual } from "@norbert-fila/react-generative-visual";

export function Hero() {
  return (
    <GenerativeVisual
      seed="hero-2026"
      colors={["#FF5500", "#FFD600", "#702EFF"]}
      height={360}
    />
  );
}
```

`seed` and `colors` are required. The other props are optional and have safe defaults.

## Frameworks

The component renders a static SVG and does not require browser APIs. It can be imported from a Next.js server component without adding `"use client"`.

## Package output

The package ships with:

- ESM JavaScript in `dist/`
- TypeScript declarations
- No demo or test files in the published tarball
- No runtime dependency other than the React peer dependency
