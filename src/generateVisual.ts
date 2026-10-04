import { clamp, hash, seededRandom } from "./random";
import type { GenerativeVisualOptions } from "./types";

export interface VisualSource {
  x: number;
  y: number;
  rx: number;
  ry: number;
  rotation: number;
  color: string;
  opacity: number;
  blend: "normal" | "multiply" | "screen";
  frequencyX: number;
  frequencyY: number;
  displacement: number;
  blur: number;
  noiseSeed: number;
}

export interface GrainModel {
  coarseFrequency: number;
  fineFrequency: number;
  coarseOpacity: number;
  fineOpacity: number;
  seed: number;
}

export interface GeneratedVisual {
  background: string;
  sources: VisualSource[];
  grain?: GrainModel;
  vignette: boolean;
}

const DEFAULTS = { complexity: 0.25, contrast: 0.78, distortion: 0.56, softness: 0.64, texture: 0.82 };
const FALLBACK_COLORS = ["#17151f", "#5d2bd9", "#0db2d4"];
const HEX_COLOR = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i;

export function generateVisual(options: GenerativeVisualOptions): GeneratedVisual {
  const seed = typeof options.seed === "string" ? options.seed : "";
  const inputColors = Array.isArray(options.colors) ? options.colors : [];
  const random = seededRandom(seed);
  const complexity = clamp(options.complexity, DEFAULTS.complexity);
  const contrast = clamp(options.contrast, DEFAULTS.contrast);
  const distortion = clamp(options.distortion, DEFAULTS.distortion);
  const softness = clamp(options.softness, DEFAULTS.softness);
  const texture = clamp(options.texture, DEFAULTS.texture);
  const safeColors = inputColors.filter((color): color is string => typeof color === "string" && HEX_COLOR.test(color));
  const colors = safeColors.length > 0 ? safeColors : FALLBACK_COLORS;
  const fieldCount = Math.round(Math.max(3, Math.min(10, options.sourceCount ?? 3 + complexity * 7)));
  const sourceScale = Math.max(0.35, Math.min(1.15, options.sourceSize ?? 0.35 + softness * 0.8));
  const separation = Math.max(0, Math.min(1, options.separation ?? 0.2 + complexity * 0.6));
  const minDistance = (120 + separation * 360) * (fieldCount <= 3 ? 1 : Math.max(0.48, 3 / fieldCount));
  const centers: Array<{ x: number; y: number }> = [];

  for (let index = 0; index < fieldCount; index += 1) {
    let best = { x: 0, y: 0 };
    let bestScore = -1;
    for (let attempt = 0; attempt < 64; attempt += 1) {
      const candidate = { x: (-0.14 + random() * 1.28) * 1000, y: (-0.14 + random() * 1.28) * 1000 };
      const distance = centers.length
        ? Math.min(...centers.map((center) => Math.hypot(candidate.x - center.x, candidate.y - center.y)))
        : 9999;
      if (distance > minDistance) {
        best = candidate;
        break;
      }
      if (distance > bestScore) {
        bestScore = distance;
        best = candidate;
      }
    }
    centers.push(best);
  }

  const roles: Array<"light" | "dark" | "color"> = fieldCount >= 3 ? ["light", "dark", "color"] : [];
  while (roles.length < fieldCount) {
    const value = random();
    roles.push(value < 0.22 ? "dark" : value < 0.4 ? "light" : "color");
  }
  for (let index = roles.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(random() * (index + 1));
    [roles[index], roles[swap]] = [roles[swap], roles[index]];
  }

  const noiseSeed = hash(seed) % 999;
  const sources = centers.map(({ x, y }, index) => {
    const radius = (270 + random() * 150) * sourceScale;
    const role = roles[index];
    const color = role === "dark" ? (random() < 0.6 ? "#020305" : "#111015") : role === "light" ? (random() < 0.55 ? "#fffbd5" : "#ffffff") : colors[1 + Math.floor(random() * Math.max(1, colors.length - 1))] ?? colors[0];
    return {
      x,
      y,
      rx: radius,
      ry: radius * (0.66 + random() * 0.52),
      rotation: -70 + random() * 140,
      color,
      opacity: Math.min(0.99, role === "dark" ? 0.3 + contrast * 0.62 : role === "light" ? 0.18 + contrast * 0.54 : 0.68 + contrast * 0.3),
      blend: role === "dark" ? "multiply" : role === "light" ? "screen" : "normal",
      frequencyX: 0.0028 + random() * 0.0025,
      frequencyY: 0.0034 + random() * 0.003,
      displacement: 8 + distortion * 105 + (random() - 0.5) * 18,
      blur: 18 + Math.max(0.1, Math.min(1, options.blur ?? softness)) * 105 + (random() - 0.5) * 18,
      noiseSeed: noiseSeed + index * 37,
    } satisfies VisualSource;
  });

  return {
    background: colors[0],
    sources,
    grain: (options.grainAmount ?? texture) > 0 ? { coarseFrequency: 0.045 + (options.grainSize ?? texture) * 0.13, fineFrequency: 0.38 + (options.grainSize ?? texture) * 0.9, coarseOpacity: (options.grainAmount ?? texture) * 0.82, fineOpacity: (options.grainAmount ?? texture) * 0.96, seed: noiseSeed } : undefined,
    vignette: options.vignette ?? false,
  };
}
