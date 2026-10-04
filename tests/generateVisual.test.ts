import { describe, expect, it } from "vitest";
import { generateVisual } from "../src/generateVisual";

const options = { seed: "album-001", colors: ["#f00", "#0f0", "#00f"] };

describe("generateVisual", () => {
  it("is deterministic", () => {
    expect(generateVisual(options)).toEqual(generateVisual({ ...options, colors: [...options.colors] }));
  });
  it("changes output for a different seed", () => {
    expect(generateVisual(options)).not.toEqual(generateVisual({ ...options, seed: "album-002" }));
  });
  it("changes output when an advanced option changes", () => {
    expect(generateVisual({ ...options, sourceCount: 3 })).not.toEqual(generateVisual({ ...options, sourceCount: 10 }));
  });
  it("clamps normalized controls and supports 2 to 8 colors", () => {
    for (const count of [2, 3, 4, 8]) {
      const visual = generateVisual({ ...options, colors: Array.from({ length: count }, (_, index) => `#${index}${index}${index}`), complexity: 4, contrast: -2, distortion: 3, softness: 9, texture: -1 });
      expect(visual.sources).toHaveLength(10);
      expect(visual.sources.every((source) => source.opacity >= 0 && source.opacity <= 0.99)).toBe(true);
    }
  });
  it("uses a fallback for empty colors", () => {
    expect(() => generateVisual({ ...options, colors: [] })).not.toThrow();
    expect(generateVisual({ ...options, colors: [] }).background).toBeTruthy();
  });
  it("rejects unsafe color values", () => {
    const visual = generateVisual({ ...options, colors: ['url("javascript:alert(1)")', '"/><script>alert(1)</script>', "#123456"] });
    expect(visual.background).toBe("#123456");
    expect(visual.sources.every((source) => source.color !== 'url("javascript:alert(1)")')).toBe(true);
  });
});
