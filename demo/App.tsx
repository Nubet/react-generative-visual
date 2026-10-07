import {
  startTransition,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { GenerativeVisual } from "../src";

const presets = [
  ["#ef2b14", "#ff7818", "#ffb91c", "#e9e31a"],
  ["#6c27f5", "#b625ff", "#ff18d8", "#e33b8c"],
  ["#07595b", "#00aaa6", "#19d7c7", "#083d43"],
  ["#0a1b38", "#183aa8", "#435cff", "#162a68"],
  ["#ff3b00", "#ff8c00", "#d8ef18", "#e91e13"],
  ["#092e2b", "#2b7d74", "#86c8ba", "#0d4a44"],
  ["#4d0828", "#9e1459", "#d61b4d", "#6c1c7a"],
  ["#20113f", "#5d2bd9", "#0db2d4", "#ef4b92"],
];
type Controls = {
  seed: string;
  colors: string[];
  complexity: number;
  contrast: number;
  distortion: number;
  softness: number;
  texture: number;
  vignette: boolean;
  sourceCount?: number;
  sourceSize?: number;
  separation?: number;
  blur?: number;
  grainAmount?: number;
  grainSize?: number;
};
const initial: Controls = {
  seed: "purple-forest",
  colors: presets[1],
  complexity: 0.6,
  contrast: 0.8,
  distortion: 0.55,
  softness: 0.7,
  texture: 0.8,
  vignette: true,
};
const stylePresets = [
  {
    id: "haze",
    name: "Haze",
    values: {
      complexity: 0.3,
      contrast: 0.62,
      distortion: 0.18,
      softness: 0.94,
      texture: 0.86,
      vignette: false,
      sourceCount: 4,
      sourceSize: 1.08,
      separation: 0.16,
      blur: 0.94,
      grainAmount: 0.86,
      grainSize: 0.78,
    },
  },
  {
    id: "bloom",
    name: "Bloom",
    values: {
      complexity: 0.3,
      contrast: 0.48,
      distortion: 0.2,
      softness: 0.96,
      texture: 0.16,
      vignette: true,
      sourceCount: 3,
      sourceSize: 1.1,
      separation: 0.16,
      blur: 0.92,
      grainAmount: 0.12,
      grainSize: 0.24,
    },
  },
  {
    id: "melt",
    name: "Melt",
    values: {
      complexity: 0.72,
      contrast: 0.7,
      distortion: 0.94,
      softness: 0.54,
      texture: 0.64,
      vignette: false,
      sourceCount: 6,
      sourceSize: 0.86,
      separation: 0.42,
      blur: 0.48,
      grainAmount: 0.52,
      grainSize: 0.42,
    },
  },
  {
    id: "ink",
    name: "Ink",
    values: {
      complexity: 0.86,
      contrast: 0.96,
      distortion: 0.34,
      softness: 0.28,
      texture: 0.92,
      vignette: true,
      sourceCount: 9,
      sourceSize: 0.62,
      separation: 0.58,
      blur: 0.16,
      grainAmount: 0.94,
      grainSize: 0.72,
    },
  },
  {
    id: "signal",
    name: "Signal",
    values: {
      complexity: 0.58,
      contrast: 0.9,
      distortion: 0.8,
      softness: 0.34,
      texture: 0.68,
      vignette: true,
      sourceCount: 5,
      sourceSize: 0.66,
      separation: 0.64,
      blur: 0.22,
      grainAmount: 0.48,
      grainSize: 0.3,
    },
  },
  {
    id: "grain",
    name: "Grain",
    values: {
      complexity: 0.46,
      contrast: 0.58,
      distortion: 0.52,
      softness: 0.7,
      texture: 0.98,
      vignette: false,
      sourceCount: 4,
      sourceSize: 0.92,
      separation: 0.38,
      blur: 0.58,
      grainAmount: 0.98,
      grainSize: 0.9,
    },
  },
  {
    id: "wide",
    name: "Wide",
    values: {
      complexity: 0.24,
      contrast: 0.66,
      distortion: 0.46,
      softness: 0.82,
      texture: 0.34,
      vignette: true,
      sourceCount: 3,
      sourceSize: 0.92,
      separation: 0.78,
      blur: 0.76,
      grainAmount: 0.24,
      grainSize: 0.5,
    },
  },
] satisfies Array<{
  id: string;
  name: string;
  values: Omit<Controls, "seed" | "colors">;
}>;
const exampleStyles = {
  avatar: { width: 96, height: 96, borderRadius: "50%" },
  card: { width: 320, height: 270, borderRadius: 16 },
  artwork: { width: 320, height: 320, borderRadius: 16 },
} satisfies Record<string, CSSProperties>;

export function App() {
  const [controls, setControls] = useState(initial);
  const [previewControls, setPreviewControls] = useState(initial);
  const [activeStyle, setActiveStyle] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const renderTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const schedulePreview = (next: Controls) => {
    if (renderTimer.current) clearTimeout(renderTimer.current);
    setIsRendering(true);
    renderTimer.current = setTimeout(
      () =>
        startTransition(() => {
          setPreviewControls(next);
          requestAnimationFrame(() => setIsRendering(false));
        }),
      120,
    );
  };
  const update = <K extends keyof Controls>(key: K, value: Controls[K]) => {
    const next = { ...controls, [key]: value } as Controls;
    setActiveStyle(null);
    setControls(next);
    schedulePreview(next);
  };
  const updateColor = (index: number, color: string) => {
    const next = {
      ...controls,
      colors: controls.colors.map((value, colorIndex) =>
        colorIndex === index ? color : value,
      ),
    };
    setActiveStyle(null);
    setControls(next);
    schedulePreview(next);
  };
  const commitHexColor = (
    index: number,
    value: string,
    input: HTMLInputElement,
  ) => {
    const normalized = value.trim().startsWith("#")
      ? value.trim()
      : `#${value.trim()}`;
    if (/^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i.test(normalized))
      updateColor(index, normalized);
    else input.value = controls.colors[index].toUpperCase();
  };
  const addColor = () => {
    if (controls.colors.length >= 8) return;
    const next = { ...controls, colors: [...controls.colors, "#ffffff"] };
    setActiveStyle(null);
    setControls(next);
    schedulePreview(next);
  };
  const removeColor = (index: number) => {
    if (controls.colors.length <= 2) return;
    const next = {
      ...controls,
      colors: controls.colors.filter((_, colorIndex) => colorIndex !== index),
    };
    setActiveStyle(null);
    setControls(next);
    schedulePreview(next);
  };
  const applyStylePreset = (preset: (typeof stylePresets)[number]) => {
    const next = { ...controls, ...preset.values };
    setActiveStyle(preset.id);
    setControls(next);
    schedulePreview(next);
  };
  const resetControls = () => {
    setActiveStyle(null);
    setControls(initial);
    schedulePreview(initial);
  };
  const sourceCount =
    controls.sourceCount ?? Math.round(3 + controls.complexity * 7);
  const sourceSize = controls.sourceSize ?? 0.35 + controls.softness * 0.8;
  const separation = controls.separation ?? 0.2 + controls.complexity * 0.6;
  const blur = controls.blur ?? controls.softness;
  const grainAmount = controls.grainAmount ?? controls.texture;
  const grainSize = controls.grainSize ?? controls.texture;
  const exampleControls = { ...initial, colors: previewControls.colors };
  const advancedCode = [
    ["sourceCount", controls.sourceCount],
    ["sourceSize", controls.sourceSize],
    ["separation", controls.separation],
    ["blur", controls.blur],
    ["grainAmount", controls.grainAmount],
    ["grainSize", controls.grainSize],
  ]
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => `  ${key}={${value}}`)
    .join("\n");
  const code = `<GenerativeVisual\n  seed="${controls.seed}"\n  colors={${JSON.stringify(controls.colors)}}\n  complexity={${controls.complexity}}\n  contrast={${controls.contrast}}\n  distortion={${controls.distortion}}\n  softness={${controls.softness}}\n  texture={${controls.texture}}${advancedCode ? `\n${advancedCode}` : ""}\n/>`;
  const randomize = () => update("seed", crypto.randomUUID().slice(0, 8));
  const copyCode = () => navigator.clipboard?.writeText(code);
  const downloadSvg = () => {
    const svg = previewRef.current?.querySelector("svg");
    if (!svg) return;
    const blob = new Blob([new XMLSerializer().serializeToString(svg)], {
      type: "image/svg+xml",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${controls.seed || "visual"}.svg`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  return (
    <main className="page">
      <header
        className="masthead"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 24,
        }}
      >
        <h1>Generative Visual</h1>
        <nav
          aria-label="Project links"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <a
            href="https://github.com/Nubet/react-generative-visual"
            target="_blank"
            rel="noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              border: "1px solid #514d45",
              color: "#a8a096",
              padding: "10px 13px",
              font: "600 11px 'Space Grotesk', sans-serif",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            GitHub <span style={{ fontSize: 15, lineHeight: 1 }}>↗</span>
          </a>
          <a
            href="./docs/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              background: "#c8ff35",
              color: "#10100f",
              padding: "11px 14px",
              font: "600 11px 'Space Grotesk', sans-serif",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Read docs <span style={{ fontSize: 16, lineHeight: 1 }}>↗</span>
          </a>
        </nav>
      </header>
      <section className="workbench">
        <aside className="controls">
          <div className="control-heading">
            <span>Playground</span>
          </div>
          <label>
            Seed
            <input
              value={controls.seed}
              onChange={(event) => update("seed", event.target.value)}
            />
          </label>
          <div className="label-row">
            <label>Palette</label>
            <span>{controls.colors.length} colors</span>
          </div>
          <div className="swatches">
            {presets.map((palette, index) => (
              <button
                key={palette.join("-")}
                className="swatch"
                style={{
                  background: `linear-gradient(135deg, ${palette.join(",")})`,
                }}
                onClick={() => update("colors", palette)}
                aria-label={`Use palette ${index + 1}`}
              />
            ))}
          </div>
          <div className="label-row">
            <label>Preset</label>
            <button
              type="button"
              onClick={resetControls}
              style={{
                border: 0,
                background: "transparent",
                color: "#a8a096",
                padding: 0,
                font: "10px 'DM Mono', monospace",
                cursor: "pointer",
                textTransform: "uppercase",
                letterSpacing: ".12em",
              }}
            >
              Reset
            </button>
          </div>
          <details
            style={{
              margin: "-8px 0 24px",
              borderBottom: "1px solid #383630",
              paddingBottom: 12,
            }}
          >
            <summary
              style={{
                cursor: "pointer",
                color: "#a8a096",
                font: "10px 'DM Mono', monospace",
                letterSpacing: ".12em",
                textTransform: "uppercase",
              }}
            >
              Choose preset
            </summary>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: 6,
                marginTop: 10,
              }}
            >
              {stylePresets.map((preset) => {
                const active = activeStyle === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyStylePreset(preset)}
                    aria-pressed={active}
                    style={{
                      minHeight: 34,
                      padding: "6px 8px",
                      textAlign: "left",
                      border: `1px solid ${active ? "#f4f0e8" : "#383630"}`,
                      background: active ? "#f4f0e8" : "#1a1917",
                      color: active ? "#10100f" : "#f4f0e8",
                      cursor: "pointer",
                      font: "500 10px 'Space Grotesk', sans-serif",
                    }}
                  >
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </details>
          <div className="custom-colors">
            {controls.colors.map((color, index) => (
              <div
                className="color-row"
                key={color}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <input
                  type="color"
                  value={color}
                  onChange={(event) => updateColor(index, event.target.value)}
                  aria-label={`Color picker ${index + 1}`}
                  style={{
                    width: 30,
                    height: 24,
                    padding: 0,
                    border: 0,
                    background: "transparent",
                  }}
                />
                <input
                  type="text"
                  defaultValue={color.toUpperCase()}
                  onBlur={(event) =>
                    commitHexColor(
                      index,
                      event.currentTarget.value,
                      event.currentTarget,
                    )
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") event.currentTarget.blur();
                  }}
                  aria-label={`Hex color ${index + 1}`}
                  spellCheck={false}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    background: "transparent",
                    border: 0,
                    borderBottom: "1px solid #514d45",
                    color: "#f4f0e8",
                    font: "11px 'DM Mono', monospace",
                    padding: "7px 0",
                    outline: 0,
                  }}
                />
                {controls.colors.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    aria-label={`Remove color ${index + 1}`}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: "#a8a096",
                      cursor: "pointer",
                      fontSize: 18,
                    }}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            className="add-color"
            onClick={addColor}
            disabled={controls.colors.length >= 8}
            style={{
              border: "1px solid #514d45",
              background: "transparent",
              color: "#a8a096",
              padding: "7px 9px",
              cursor: controls.colors.length >= 8 ? "not-allowed" : "pointer",
              marginBottom: 24,
            }}
          >
            + Add color
          </button>
          <Control
            label="Complexity"
            value={controls.complexity}
            onChange={(value) => update("complexity", value)}
          />
          <Control
            label="Contrast"
            value={controls.contrast}
            onChange={(value) => update("contrast", value)}
          />
          <Control
            label="Distortion"
            value={controls.distortion}
            onChange={(value) => update("distortion", value)}
          />
          <Control
            label="Softness"
            value={controls.softness}
            onChange={(value) => update("softness", value)}
          />
          <Control
            label="Texture"
            value={controls.texture}
            onChange={(value) => update("texture", value)}
          />
          <details
            style={{
              margin: "20px 0 24px",
              borderTop: "1px solid #383630",
              paddingTop: 16,
            }}
          >
            <summary
              style={{ cursor: "pointer", color: "#a8a096", fontSize: 12 }}
            >
              Advanced settings
            </summary>
            <div style={{ paddingTop: 20 }}>
              <IntegerControl
                label="Source count"
                value={sourceCount}
                min={3}
                max={10}
                onChange={(value) => update("sourceCount", value)}
              />
              <AdvancedControl
                label="Source size"
                value={sourceSize}
                min={0.35}
                max={1.15}
                onChange={(value) => update("sourceSize", value)}
              />
              <AdvancedControl
                label="Separation"
                value={separation}
                onChange={(value) => update("separation", value)}
              />
              <AdvancedControl
                label="Blur"
                value={blur}
                min={0.1}
                onChange={(value) => update("blur", value)}
              />
              <AdvancedControl
                label="Grain amount"
                value={grainAmount}
                onChange={(value) => update("grainAmount", value)}
              />
              <AdvancedControl
                label="Grain size"
                value={grainSize}
                onChange={(value) => update("grainSize", value)}
              />
            </div>
          </details>
          <label className="check">
            <input
              type="checkbox"
              checked={controls.vignette}
              onChange={(event) => update("vignette", event.target.checked)}
            />{" "}
            Vignette
          </label>
          <button className="randomize" onClick={randomize}>
            Randomize seed <span>↗</span>
          </button>
        </aside>
        <div className="preview">
          <div ref={previewRef} style={{ position: "relative" }}>
            <GenerativeVisual
              {...previewControls}
              style={{
                width: "100%",
                aspectRatio: "1.5 / 1",
                borderRadius: 22,
              }}
            />
            {isRendering && (
              <div
                role="status"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  background: "rgb(16 16 15 / 52%)",
                  color: "#c8ff35",
                  font: "12px 'DM Mono', monospace",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                }}
              >
                Rendering preview...
              </div>
            )}
          </div>
          <div
            className="preview-actions"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 12,
            }}
          >
            <button
              type="button"
              onClick={copyCode}
              style={{
                border: "1px solid #514d45",
                background: "transparent",
                color: "#a8a096",
                padding: "7px 10px",
                font: "10px 'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              Copy code
            </button>
            <button
              type="button"
              onClick={downloadSvg}
              style={{
                border: "1px solid #514d45",
                background: "transparent",
                color: "#a8a096",
                padding: "7px 10px",
                font: "10px 'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              Download SVG
            </button>
          </div>
        </div>
      </section>
      <section className="snippet">
        <div>
          <h2>API</h2>
        </div>
        <div className="code-wrap">
          <pre>{code}</pre>
        </div>
      </section>
      <section className="use-cases">
        <div className="section-title">
          <h2>Examples</h2>
        </div>
        <div className="case-grid">
          <Case
            label="Avatar"
            className="avatar"
            seed="alice"
            controls={exampleControls}
            visualStyle={exampleStyles.avatar}
          />
          <Case
            label="Card"
            className="card-art"
            seed="project"
            controls={exampleControls}
            visualStyle={exampleStyles.card}
          />
          <Case
            label="Artwork"
            className="artwork"
            seed="artwork"
            controls={exampleControls}
            visualStyle={exampleStyles.artwork}
          >
            <div>
              <span className="art-kicker">Artwork / 01</span>
              <strong>Night bloom</strong>
            </div>
          </Case>
        </div>
      </section>
    </main>
  );
}

function Control({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-label">
      <span>
        {label}
        <b>{Math.round(value * 100)}%</b>
      </span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function AdvancedControl({
  label,
  value,
  min = 0,
  max = 1,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-label">
      <span>
        {label}
        <b>{Math.round(value * 100)}%</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="0.01"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function IntegerControl({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="range-label">
      <span>
        {label}
        <b>{value}</b>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
function Case({
  label,
  className,
  seed,
  controls,
  visualStyle,
  children,
}: {
  label: string;
  className: string;
  seed: string;
  controls: Controls;
  visualStyle: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <article>
      <div className={className}>
        <GenerativeVisual {...controls} seed={seed} style={visualStyle}>
          {children}
        </GenerativeVisual>
      </div>
      <p>{label}</p>
    </article>
  );
}
