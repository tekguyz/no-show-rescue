import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRODUCT_MARK_SVG } from "@/lib/brand";
import { metadata as demoMetadata } from "@/app/demo/layout";

// Rules from DEMO-STANDARD.md and the TEKGUYZ hard rules that a test can pin.

const root = join(import.meta.dirname, "..", "..");
const sourceDirs = ["app", "components", "lib"];

function files(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "__tests__" || name === "_og" ? [] : files(path);
    return /\.(ts|tsx|svg|css)$/.test(name) ? [path] : [];
  });
}

const sources = sourceDirs.flatMap((d) => files(join(root, d))).map((path) => ({ path, text: readFileSync(path, "utf8") }));

describe("guards", () => {
  it("has source files to check", () => {
    expect(sources.length).toBeGreaterThan(10);
  });

  it("never writes a phone number, real or placeholder", () => {
    const phone = /\(?\b\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}\b|555-\d{4}/;
    for (const { path, text } of sources) expect(text, path).not.toMatch(phone);
  });

  it("never writes a price", () => {
    for (const { path, text } of sources) expect(text, path).not.toMatch(/\$\d/);
  });

  it("names TEKGUYZ only in the small 'Built by' credit", () => {
    for (const { path, text } of sources) {
      const lines = text.split("\n").filter((l) => l.includes("TEKGUYZ") && !l.trim().startsWith("//") && !l.includes("DEMO-STANDARD"));
      for (const line of lines) expect(line.trim(), path).toMatch(/^(TEKGUYZ|.*Built by.*|"Demo banner.*)$/);
    }
  });

  it("keeps every demo screen out of search", () => {
    expect(demoMetadata.robots).toMatchObject({ index: false, follow: false });
  });

  it("keeps the favicon the same as the picked mark", () => {
    expect(readFileSync(join(root, "app/icon.svg"), "utf8").trim()).toBe(PRODUCT_MARK_SVG);
  });

  it("sends no header that would stop the demo working in a frame", () => {
    const config = readFileSync(join(root, "next.config.ts"), "utf8");
    expect(config).not.toMatch(/X-Frame-Options|frame-ancestors/i);
  });
});
