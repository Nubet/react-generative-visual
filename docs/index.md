# React Generative Visual

Deterministic generative visuals for React.

The package renders layered SVG artwork from a seed, a color palette, and a small set of visual controls. The same input produces the same visual.

## What it does

- Renders a responsive SVG component.
- Uses seeded randomness instead of runtime randomness.
- Accepts custom color palettes.
- Supports core and advanced visual controls.
- Works in browser apps and server-rendered React apps.
- Has no runtime dependencies beyond React.

## Quick start

```tsx
import { GenerativeVisual } from "@norbert-fila/react-generative-visual";

export function Cover() {
  return (
    <GenerativeVisual
      seed="cover-01"
      colors={["#20113F", "#5D2BD9", "#0DB2D4", "#EF4B92"]}
      style={{ width: "100%", height: 320, borderRadius: 24 }}
    />
  );
}
```

Start with the [installation guide](?page=installation), then use the [API reference](?page=api) to tune the result.

For practical patterns, see [usage recipes](?page=recipes). For behavior and current limits, see [FAQ](?page=faq).
