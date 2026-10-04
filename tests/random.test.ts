import { describe, expect, it } from "vitest";
import { hash, seededRandom } from "../src/random";

describe("seeded random", () => {
  it("repeats the same sequence for the same seed", () => {
    expect(Array.from({ length: 4 }, seededRandom("same"))).toEqual(Array.from({ length: 4 }, seededRandom("same")));
  });
  it("changes the sequence for different seeds", () => {
    expect(hash("one")).not.toBe(hash("two"));
  });
  it("handles empty, unicode, and long seeds", () => {
    expect(() => seededRandom("")()).not.toThrow();
    expect(() => seededRandom("żółć")()).not.toThrow();
    expect(() => seededRandom("x".repeat(10000))()).not.toThrow();
  });
});
