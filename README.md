# @norbert-fila/react-generative-visual

Deterministic generative visuals for React.

- SVG native
- Zero runtime dependencies
- Seeded and deterministic
- Custom palettes
- Responsive sizing
- SSR-safe
- React 18+

## Install

```bash
npm install @norbert-fila/react-generative-visual
```

## Usage

```tsx
import { GenerativeVisual } from "@norbert-fila/react-generative-visual";

<GenerativeVisual
  seed="hello"
  colors={["#FF5500", "#FFD600", "#702EFF"]}
/>
```

The same seed and options produce the same visual. The component renders a static SVG and does not use Canvas, WebGL, browser APIs, or external assets.

## Props

### Core controls

All normalized controls use values from `0` to `1`.

```tsx
<GenerativeVisual
  seed="project-123"
  colors={["#FF5500", "#FFD600", "#702EFF"]}
  complexity={0.6}
  contrast={0.8}
  distortion={0.55}
  softness={0.7}
  texture={0.8}
  vignette
/>
```

Available core props:

- `seed: string` required
- `colors: string[]` required; supports 2-8 colors
- `complexity?: number`
- `contrast?: number`
- `distortion?: number`
- `softness?: number`
- `texture?: number`
- `vignette?: boolean`

### Advanced controls

Advanced props are optional. When provided, they override the corresponding core mapping.

```tsx
<GenerativeVisual
  seed="detailed"
  colors={["#20113F", "#5D2BD9", "#0DB2D4", "#EF4B92"]}
  sourceCount={3}
  sourceSize={1.06}
  separation={0.24}
  blur={0.64}
  grainAmount={0.82}
  grainSize={0.52}
/>
```

- `sourceCount?: number` from 3 to 10
- `sourceSize?: number` from `0.35` to `1.15`
- `separation?: number` from `0` to `1`
- `blur?: number` from `0.1` to `1`
- `grainAmount?: number` from `0` to `1`
- `grainSize?: number` from `0` to `1`

Values are clamped to safe ranges.

### Layout and content

```tsx
<GenerativeVisual
  seed="hero"
  colors={["#F00", "#00F"]}
  width="100%"
  height={320}
  className="visual"
  style={{ borderRadius: 24 }}
>
  <h2>Overlay content</h2>
</GenerativeVisual>
```

`children` are rendered above the SVG. The component does not style or constrain the content. Use `preserveAspectRatio="xMidYMid slice"` behavior for cover-style rendering.

## Next.js

The component is SSR-safe and does not require `"use client"`.

```tsx
import { GenerativeVisual } from "@norbert-fila/react-generative-visual";

export default function Page() {
  return <GenerativeVisual seed="next" colors={["#F00", "#00F"]} />;
}
```

## Playground

Run the local demo from the repository root:

```bash
npm install
npm run dev
```

The playground includes:

- eight preset palettes
- color picker and HEX input editing
- custom palette colors from 2 to 8
- core and advanced generator controls
- deferred preview rendering with a loading state
- copyable React code
- Avatar, Card, and Artwork examples

## Development scripts

```bash
npm run dev
npm run typecheck
npm run test
npm run build
npm run build:demo
npm pack --dry-run
```

`npm run build` creates the library output in `dist/`. `npm run build:demo` creates the static playground in `dist-demo/`.
