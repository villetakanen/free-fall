import { rehype } from "rehype";
import { describe, expect, it } from "vitest";
import { rehypeContentUrlRewrite } from "./rehype-content-url-rewrite";

describe("rehypeContentUrlRewrite", () => {
  const processor = rehype()
    .data("settings", { fragment: true })
    .use(rehypeContentUrlRewrite, { basePath: "/core-rulebook/" });

  const processFile = async (html: string, filepath?: string) => {
    const vfile: { value: string; path?: string } = { value: html };
    if (filepath !== undefined) {
      vfile.path = filepath;
    }
    const result = await processor.process(vfile);
    return result.toString();
  };

  const defaultPath = "/content/core-rulebook/test.md";

  it("adds basePath to relative links", async () => {
    const html = `<a href="system-reference">Link</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/core-rulebook/system-reference/">Link</a>`,
    );
  });

  it("handles hash links properly by ensuring trailing slash before hash", async () => {
    const html = `<a href="system-reference#action-resolution">Link</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/core-rulebook/system-reference/#action-resolution">Link</a>`,
    );
  });

  it("keeps pure hashes unchanged", async () => {
    const html = `<a href="#top">Top</a>`;
    expect(await processFile(html, defaultPath)).toBe(`<a href="#top">Top</a>`);
  });

  it("ignores absolute paths", async () => {
    const html = `<a href="/about/">About</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/about/">About</a>`,
    );
  });

  it("ignores external urls", async () => {
    const html = `<a href="https://example.com">Ext</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="https://example.com">Ext</a>`,
    );

    const htmlHttp = `<a href="http://example.com">Ext</a>`;
    expect(await processFile(htmlHttp, defaultPath)).toBe(
      `<a href="http://example.com">Ext</a>`,
    );
  });

  it("processes links starting with http like httpbin-test", async () => {
    const html = `<a href="httpbin-test">Ext</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/core-rulebook/httpbin-test/">Ext</a>`,
    );
  });

  it("strips .md extensions", async () => {
    const html = `<a href="system-reference.md#top">Link</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/core-rulebook/system-reference/#top">Link</a>`,
    );
  });

  it("strips ./ from relative paths", async () => {
    const html = `<a href="./system-reference">Link</a>`;
    expect(await processFile(html, defaultPath)).toBe(
      `<a href="/core-rulebook/system-reference/">Link</a>`,
    );
  });

  it("skips processing when file path is missing", async () => {
    const html = `<a href="system-reference">Link</a>`;
    const result = await processFile(html);
    expect(result).toBe(`<a href="system-reference">Link</a>`);
  });

  it("skips processing when file path doesn't match contentPath", async () => {
    const html = `<a href="system-reference">Link</a>`;
    const result = await processFile(html, "/src/pages/about.md");
    expect(result).toBe(`<a href="system-reference">Link</a>`);
  });
});
