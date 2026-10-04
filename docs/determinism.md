# Determinism

The visual is generated from a seeded random sequence.

```text
seed + options -> generated SVG model
```

The same seed alone is not enough for an identical result. The options must also be the same:

```text
same seed + same options = same visual
same seed + different options = different visual
```

Changing a core or advanced control changes how the generated model is built or rendered. It does not mutate the seed.

## Good seed usage

Use a stable identifier when a visual should remain stable:

```tsx
<GenerativeVisual seed={`project-${project.id}`} colors={palette} />
```

Use a new seed when you want a new composition:

```tsx
<GenerativeVisual seed="cover-variant-b" colors={palette} />
```

## SSR

Generation is synchronous and does not depend on `window`, `document`, storage, network requests, Canvas, or WebGL. The component is safe to render on the server.
