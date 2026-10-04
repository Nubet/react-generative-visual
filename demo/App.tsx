import { useState, type CSSProperties, type ReactNode } from "react";
import { GenerativeVisual } from "../src";

const presets = [["#ef2b14", "#ff7818", "#ffb91c", "#e9e31a"], ["#6c27f5", "#b625ff", "#ff18d8", "#e33b8c"], ["#07595b", "#00aaa6", "#19d7c7", "#083d43"], ["#0a1b38", "#183aa8", "#435cff", "#162a68"]];
type Controls = { seed: string; colors: string[]; complexity: number; contrast: number; distortion: number; softness: number; texture: number; vignette: boolean };
const initial: Controls = { seed: "purple-forest", colors: presets[1], complexity: 0.6, contrast: 0.8, distortion: 0.55, softness: 0.7, texture: 0.8, vignette: true };

export function App() {
  const [controls, setControls] = useState(initial);
  const update = <K extends keyof Controls>(key: K, value: Controls[K]) => setControls((current) => ({ ...current, [key]: value }));
  const code = `<GenerativeVisual\n  seed="${controls.seed}"\n  colors={${JSON.stringify(controls.colors)}}\n  complexity={${controls.complexity}}\n  contrast={${controls.contrast}}\n  distortion={${controls.distortion}}\n  softness={${controls.softness}}\n  texture={${controls.texture}}\n/>`;
  const randomize = () => update("seed", crypto.randomUUID().slice(0, 8));
  return <main className="page">
    <header className="masthead"><h1>Generative Visual</h1></header>
    <section className="workbench"><aside className="controls"><div className="control-heading"><span>Playground</span></div>
      <label>Seed<input value={controls.seed} onChange={(event) => update("seed", event.target.value)} /></label>
      <div className="label-row"><label>Palette</label><span>{controls.colors.length} colors</span></div><div className="swatches">{presets.map((palette, index) => <button key={palette.join("-")} className="swatch" style={{ background: `linear-gradient(135deg, ${palette.join(",")})` }} onClick={() => update("colors", palette)} aria-label={`Use palette ${index + 1}`} />)}</div>
      <Control label="Complexity" value={controls.complexity} onChange={(value) => update("complexity", value)} /><Control label="Contrast" value={controls.contrast} onChange={(value) => update("contrast", value)} /><Control label="Distortion" value={controls.distortion} onChange={(value) => update("distortion", value)} /><Control label="Softness" value={controls.softness} onChange={(value) => update("softness", value)} /><Control label="Texture" value={controls.texture} onChange={(value) => update("texture", value)} />
      <label className="check"><input type="checkbox" checked={controls.vignette} onChange={(event) => update("vignette", event.target.checked)} /> Vignette</label><button className="randomize" onClick={randomize}>Randomize seed <span>↗</span></button>
    </aside><div className="preview"><GenerativeVisual {...controls} style={{ width: "100%", aspectRatio: "1.5 / 1", borderRadius: 22 }} /><div className="preview-note"><span>{controls.seed}</span></div></div></section>
    <section className="snippet"><div><h2>API</h2></div><div className="code-wrap"><pre>{code}</pre><button onClick={() => navigator.clipboard?.writeText(code)}>Copy code</button></div></section>
    <section className="use-cases"><div className="section-title"><h2>Examples</h2></div><div className="case-grid"><Case label="Avatar" className="avatar" seed="alice" controls={controls} visualStyle={{ width: 96, height: 96, borderRadius: "50%" }} /><Case label="Card" className="card-art" seed="project" controls={controls} visualStyle={{ width: 320, height: 270, borderRadius: 16 }} /><Case label="Artwork" className="artwork" seed="artwork" controls={controls} visualStyle={{ width: 320, height: 320, borderRadius: 16 }}><div><span className="art-kicker">Artwork / 01</span><strong>Night bloom</strong></div></Case></div></section>
  </main>;
}

function Control({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <label className="range-label"><span>{label}<b>{Math.round(value * 100)}%</b></span><input type="range" min="0" max="1" step="0.01" value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>; }
function Case({ label, className, seed, controls, visualStyle, children }: { label: string; className: string; seed: string; controls: Controls; visualStyle: CSSProperties; children?: ReactNode }) { return <article><div className={className}><GenerativeVisual {...controls} seed={seed} style={visualStyle}>{children}</GenerativeVisual></div><p>{label}</p></article>; }
