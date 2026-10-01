import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { type PluggableList, unified } from "unified";
import { describe, expect, it } from "vitest";
import config from "../../astro.config";

function createProcessor() {
  return unified()
    .use(remarkParse)
    .use(config.markdown?.remarkPlugins as PluggableList)
    .use(remarkRehype)
    .use(config.markdown?.rehypePlugins as PluggableList)
    .use(rehypeStringify);
}

describe("configured content pipeline", () => {
  it.each([
    "core-rulebook",
    "scenarios",
    "srd",
  ])("resolves terms and relative links and rejects unknown terms in %s", async (contentPackage) => {
    const processor = createProcessor();
    const path = `/content/${contentPackage}/example.md`;
    const html = String(
      await processor.process({
        path,
        value:
          ":term[Action Pool] and [Rules](./03-core-rules.md#action-resolution)",
      }),
    );
    expect(html).toContain(
      '<a href="/core-rulebook/registry/#action-pool" class="game-term" data-term-key="action-pool" rel="glossary">Action Pool</a>',
    );
    expect(html).toContain(
      'href="/core-rulebook/03-core-rules/#action-resolution"',
    );
    await expect(
      processor.process({ path, value: ":term[Definitely Missing Term]" }),
    ).rejects.toThrow('Unresolved term "Definitely Missing Term"');
  });

  it("leaves app-owned markdown outside the content packages untouched", async () => {
    const html = String(
      await createProcessor().process({
        path: "/src/pages/about.md",
        value: ":term[Definitely Missing Term] and [About](./about.md)",
      }),
    );
    expect(html).not.toContain("game-term");
    expect(html).toContain('href="./about.md"');
  });
});
