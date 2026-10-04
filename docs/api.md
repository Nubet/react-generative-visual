# API reference

## Required props

### `seed`

`string`

Controls the deterministic random sequence. The same seed with the same options produces the same visual.

### `colors`

`string[]`

The palette used by the visual. Use two to eight valid HEX colors. The first color becomes the background.

## Core controls

Core controls use values from `0` to `1`.

| Prop | Default | Effect |
| --- | ---: | --- |
| `complexity` | `0.25` | Default source count when `sourceCount` is not set. |
| `contrast` | `0.78` | Opacity and strength of the generated sources. |
| `distortion` | `0.56` | Displacement applied to each source. |
| `softness` | `0.64` | Default source size and blur. |
| `texture` | `0.82` | Default grain amount and grain size. |
| `vignette` | `false` | Adds a dark edge vignette. |

## Advanced controls

Advanced controls override the related core mapping when provided.

| Prop | Range | Effect |
| --- | ---: | --- |
| `sourceCount` | `3`–`10` | Number of generated sources. |
| `sourceSize` | `0.35`–`1.15` | Scale of each source. |
| `separation` | `0`–`1` | Minimum distance between source centers. |
| `blur` | `0.1`–`1` | SVG blur strength. |
| `grainAmount` | `0`–`1` | Opacity of the grain layers. |
| `grainSize` | `0`–`1` | Frequency of the grain layers. |

All numeric values are clamped to their safe range.

## Layout props

The component also accepts standard presentation props:

```tsx
<GenerativeVisual
  seed="card"
  colors={["#20113F", "#0DB2D4"]}
  width="100%"
  height={280}
  className="visual"
  style={{ borderRadius: 20 }}
>
  <span>Content above the SVG</span>
</GenerativeVisual>
```

`children` are placed above the SVG. The component does not style or constrain them.

## Package format

The package currently exposes an ESM entry point and TypeScript declarations. Import the component with `import`; CommonJS `require()` is not supported by the current export map.

## Color input

The playground recommends two to eight colors. At runtime, each value is checked against the `#RGB` and `#RRGGBB` formats. Invalid values are ignored. If the input contains no valid colors, the renderer uses its fallback palette.
