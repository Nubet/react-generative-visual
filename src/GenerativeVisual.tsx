import { memo, useId, useMemo } from "react";
import { generateVisual } from "./generateVisual";
import type { GenerativeVisualProps } from "./types";

function safeId(value: string): string {
  return `gv-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

export const GenerativeVisual = memo(function GenerativeVisual({
  seed,
  colors,
  complexity,
  contrast,
  distortion,
  softness,
  texture,
  vignette = false,
  sourceCount,
  sourceSize,
  separation,
  blur,
  grainAmount,
  grainSize,
  width,
  height,
  className,
  style,
  children,
}: GenerativeVisualProps) {
  const reactId = useId();
  const namespace = safeId(reactId);
  const visual = useMemo(() => generateVisual({ seed, colors, complexity, contrast, distortion, softness, texture, vignette, sourceCount, sourceSize, separation, blur, grainAmount, grainSize }), [seed, colors, complexity, contrast, distortion, softness, texture, vignette, sourceCount, sourceSize, separation, blur, grainAmount, grainSize]);
  const sizeStyle = { width, height };

  return (
    <div className={className} style={{ position: "relative", overflow: "hidden", ...sizeStyle, ...style }}>
      <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          {visual.sources.map((source, index) => (
            <filter key={index} id={`${namespace}-source-${index}`} x="-100%" y="-100%" width="300%" height="300%" colorInterpolationFilters="sRGB">
              <feTurbulence type="fractalNoise" baseFrequency={`${source.frequencyX} ${source.frequencyY}`} numOctaves="4" seed={source.noiseSeed} result="warp" />
              <feDisplacementMap in="SourceGraphic" in2="warp" scale={source.displacement} xChannelSelector="R" yChannelSelector="B" result="displaced" />
              <feGaussianBlur in="displaced" stdDeviation={source.blur} />
            </filter>
          ))}
          {visual.grain && <GrainFilters grain={visual.grain} namespace={namespace} />}
          {visual.vignette && <radialGradient id={`${namespace}-vignette`}><stop offset="48%" stopColor="#000" stopOpacity="0" /><stop offset="100%" stopColor="#000" stopOpacity=".30" /></radialGradient>}
        </defs>
        <rect width="1000" height="1000" fill={visual.background} />
        <g>
          {visual.sources.map((source, index) => (
            <ellipse key={index} cx={source.x} cy={source.y} rx={source.rx} ry={source.ry} fill={source.color} opacity={source.opacity} style={{ mixBlendMode: source.blend }} transform={`rotate(${source.rotation} ${source.x} ${source.y})`} filter={`url(#${namespace}-source-${index})`} />
          ))}
        </g>
        {visual.grain && <GrainRects grain={visual.grain} namespace={namespace} />}
        {visual.vignette && <rect width="1000" height="1000" fill={`url(#${namespace}-vignette)`} />}
      </svg>
      {children && <div style={{ position: "relative", zIndex: 1, width: "100%", height: "100%" }}>{children}</div>}
    </div>
  );
});

function GrainFilters({ grain, namespace }: { grain: NonNullable<ReturnType<typeof generateVisual>["grain"]>; namespace: string }) {
  return <>
    <filter id={`${namespace}-coarse-grain`} x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency={grain.coarseFrequency} numOctaves="3" seed={grain.seed + 19} stitchTiles="stitch" result="noise" /><feColorMatrix in="noise" type="saturate" values="0" result="mono" /><feComponentTransfer in="mono"><feFuncR type="linear" slope="1.9" intercept="-.42" /><feFuncG type="linear" slope="1.9" intercept="-.42" /><feFuncB type="linear" slope="1.9" intercept="-.42" /><feFuncA type="table" tableValues="0 .24" /></feComponentTransfer></filter>
    <filter id={`${namespace}-fine-grain`} x="-10%" y="-10%" width="120%" height="120%"><feTurbulence type="fractalNoise" baseFrequency={grain.fineFrequency} numOctaves="4" seed={grain.seed + 41} stitchTiles="stitch" result="noise" /><feColorMatrix in="noise" type="saturate" values="0" result="mono" /><feComponentTransfer in="mono"><feFuncR type="linear" slope="2.35" intercept="-.67" /><feFuncG type="linear" slope="2.35" intercept="-.67" /><feFuncB type="linear" slope="2.35" intercept="-.67" /><feFuncA type="table" tableValues="0 .31" /></feComponentTransfer></filter>
  </>;
}

function GrainRects({ grain, namespace }: { grain: NonNullable<ReturnType<typeof generateVisual>["grain"]>; namespace: string }) {
  return <>
    <rect width="1000" height="1000" fill="#777" filter={`url(#${namespace}-coarse-grain)`} opacity={grain.coarseOpacity} style={{ mixBlendMode: "soft-light" }} />
    <rect width="1000" height="1000" fill="#777" filter={`url(#${namespace}-fine-grain)`} opacity={grain.fineOpacity} style={{ mixBlendMode: "overlay" }} />
  </>;
}
