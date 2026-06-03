import { describe, it, expect } from "vitest";
import { slugify } from "./slugify";

describe("slugify", () => {
  it("lowercases and replaces spaces", () => {
    expect(slugify("Hello World")).toBe("hello-world");
  });

  it("preserves Arabic characters", () => {
    expect(slugify("بيت الشباب")).toContain("بيت");
  });
});
