# Usage recipes

## Stable hero background

Use a named seed when the same visual should survive reloads and deployments:

```tsx
const heroPalette = ["#111111", "#2B7D74", "#86C8BA", "#F4F0E8"];

<GenerativeVisual
  seed="homepage-hero"
  colors={heroPalette}
  width="100%"
  height={420}
  style={{ borderRadius: 28 }}
/>
```

Changing the seed creates a new composition. Changing the palette keeps the composition logic but changes its color language.

## A visual identifier

Use a stable ID as the seed when each record needs its own visual:

```tsx
<GenerativeVisual
  seed={`project-${project.id}`}
  colors={["#20113F", "#5D2BD9", "#0DB2D4"]}
  width={96}
  height={96}
  style={{ borderRadius: "50%" }}
/>
```

This does not require storing an image. The visual can be regenerated from the ID whenever it is rendered.

## A controlled artwork

Use advanced props when the result needs a clear shape direction:

```tsx
<GenerativeVisual
  seed="poster-01"
  colors={["#F4F0E8", "#111111", "#D61B4D"]}
  sourceCount={7}
  sourceSize={0.72}
  separation={0.62}
  blur={0.28}
  grainAmount={0.78}
  grainSize={0.64}
  vignette
  width="100%"
  height={560}
/>
```

## Overlay content

Children are rendered above the SVG. Give the wrapper its size and style, then place content inside it:

```tsx
<GenerativeVisual
  seed="feature-card"
  colors={["#10100F", "#C8FF35", "#F4F0E8"]}
  width="100%"
  height={280}
  style={{ borderRadius: 20 }}
>
  <div style={{ padding: 24 }}>
    <p>Built from a seed.</p>
  </div>
</GenerativeVisual>
```

The package does not position or style the children beyond placing them above the SVG. That keeps the component usable with any design system.
