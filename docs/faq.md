# FAQ

## Is the package ESM-only?

Yes. Use a normal ESM import:

```tsx
import { GenerativeVisual } from "@norbert-fila/react-generative-visual";
```

CommonJS `require()` is not part of the current package API.

## Are presets exported by the package?

Not currently. The named presets in the playground are demo controls. In application code, pass the visual parameters directly. This keeps the package API small and lets each product define its own presets.

## Does the package animate visuals?

No. The component renders a static SVG. Use a new seed or new options to create a different result. Animation can be composed around the component with CSS or a motion library, but it is not built into the package.

## Does the package export SVG or PNG files?

The package does not include an export helper. The playground has a `Download SVG` action for the current preview. In an application, render the component into your own export flow if file generation is required.

## How many colors can I pass?

The playground limits palettes to two through eight colors. The renderer validates every color value at runtime and uses a fallback palette if no valid colors remain. Two to eight colors is the recommended range for predictable palette selection.

## Can I use arbitrary CSS colors?

No. Use `#RGB` or `#RRGGBB` values. CSS functions, named colors, and URLs are not accepted as palette values.

## Does `children` have a layout contract?

Only a small one: children are rendered above the SVG inside a full-size relative layer. The component does not add padding, typography, alignment, or responsive rules. Style the children yourself.

## Are the docs generated from TypeScript types?

No. The Markdown files in the repository are the documentation source of truth. The TypeScript types define the compile-time API, while the docs explain behavior and usage.

## What happens when advanced props are provided?

Advanced props override their related core mapping:

- `sourceCount` overrides the count derived from `complexity`.
- `sourceSize` overrides the size derived from `softness`.
- `separation` overrides the spacing derived from `complexity`.
- `blur` overrides the blur derived from `softness`.
- `grainAmount` and `grainSize` override the values derived from `texture`.

The seed remains the same. The generated result changes because the options changed.

## Is this mainly a background tool or an artwork tool?

Both. The component is intentionally low-level enough for backgrounds, cards, avatars, and identifiers, but its advanced controls also support poster-like artwork. It does not provide an opinionated content model or design system.
