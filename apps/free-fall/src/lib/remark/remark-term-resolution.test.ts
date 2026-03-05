import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import rehypeStringify from "rehype-stringify";
import remarkDirective from "remark-directive";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import { describe, expect, it } from "vitest";
import {
  remarkTermResolution,
  type TermResolutionOptions,
} from "./remark-term-resolution";

function createRegistry(terms: string[]): string {
  const dir = mkdtempSync(join(tmpdir(), "term-test-"));
  const registryPath = join(dir, "registry.md");
  const content = terms
    .map((t) => {
      const id = t
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-|-$/g, "");
      return `<dfn id="${id}">${t}</dfn>\n\nDefinition of ${t}.`;
    })
    .join("\n\n");
  writeFileSync(
    registryPath,
    `---\ntitle: Registry\n---\n\n# Registry\n\n${content}`,
  );
  return registryPath;
}

function createProcessor(options: TermResolutionOptions) {
  return unified()
    .use(remarkParse)
    .use(remarkDirective)
    .use(remarkTermResolution, options)
    .use(remarkRehype)
    .use(rehypeStringify);
}

async function process(
  processor: ReturnType<typeof createProcessor>,
  markdown: string,
  filePath: string,
) {
  const result = await processor.process({ value: markdown, path: filePath });
  return result.toString();
}

const contentPath = "/content/core-rulebook/";
const defaultFilePath = "/content/core-rulebook/chapters/01-intro.md";

describe("remarkTermResolution", () => {
  it("transforms :term[Action Pool] into an anchor tag", async () => {
    const registryPath = createRegistry(["Action Pool"]);
    const proc = createProcessor({ registryPath, contentPath });
    const html = await process(
      proc,
      "Allocate your :term[Action Pool] wisely.",
      defaultFilePath,
    );
    expect(html).toContain('href="./registry#action-pool"');
    expect(html).toContain('class="game-term"');
    expect(html).toContain('data-term-key="action-pool"');
    expect(html).toContain('rel="glossary"');
    expect(html).toContain(">Action Pool</a>");
  });

  it("handles multiple terms in one file", async () => {
    const registryPath = createRegistry(["Action Pool", "Target Number"]);
    const proc = createProcessor({ registryPath, contentPath });
    const html = await process(
      proc,
      "Roll your :term[Action Pool] against the :term[Target Number].",
      defaultFilePath,
    );
    expect(html).toContain('data-term-key="action-pool"');
    expect(html).toContain('data-term-key="target-number"');
  });

  describe("slugification", () => {
    it("lowercases and hyphenates", async () => {
      const registryPath = createRegistry(["Harm Slot"]);
      const proc = createProcessor({ registryPath, contentPath });
      const html = await process(proc, ":term[Harm Slot]", defaultFilePath);
      expect(html).toContain('data-term-key="harm-slot"');
    });

    it("strips special characters", async () => {
      const registryPath = createRegistry(["Armor Value (AV)"]);
      const proc = createProcessor({ registryPath, contentPath });
      const html = await process(
        proc,
        ":term[Armor Value (AV)]",
        defaultFilePath,
      );
      expect(html).toContain('data-term-key="armor-value-av"');
    });

    it("collapses multiple hyphens", async () => {
      const dir = mkdtempSync(join(tmpdir(), "term-test-"));
      const registryPath = join(dir, "registry.md");
      writeFileSync(
        registryPath,
        '<dfn id="some-term">Some  Term</dfn>\n\nDef.',
      );
      const proc = createProcessor({ registryPath, contentPath });
      const html = await process(proc, ":term[Some  Term]", defaultFilePath);
      expect(html).toContain('data-term-key="some-term"');
    });
  });

  describe("validation", () => {
    it("throws on orphaned term", async () => {
      const registryPath = createRegistry(["Action Pool"]);
      const proc = createProcessor({ registryPath, contentPath });
      await expect(
        process(proc, ":term[Plasma Rifle]", defaultFilePath),
      ).rejects.toThrow(/Unresolved term "Plasma Rifle"/);
    });

    it("throws when registry file is missing", async () => {
      const proc = createProcessor({
        registryPath: "/nonexistent/registry.md",
        contentPath,
      });
      await expect(
        process(proc, ":term[Anything]", defaultFilePath),
      ).rejects.toThrow(/Registry not found/);
    });
  });

  describe("content path guard", () => {
    it("skips files outside contentPath", async () => {
      const registryPath = createRegistry(["Action Pool"]);
      const proc = createProcessor({ registryPath, contentPath });
      const html = await process(
        proc,
        ":term[Nonexistent Term]",
        "/src/pages/about.md",
      );
      expect(html).not.toContain("game-term");
      expect(html).not.toThrow;
    });

    it("skips files with no path", async () => {
      const registryPath = createRegistry(["Action Pool"]);
      const proc = createProcessor({ registryPath, contentPath });
      const result = await proc.process({ value: ":term[Nonexistent Term]" });
      expect(result.toString()).not.toContain("game-term");
    });
  });
});
