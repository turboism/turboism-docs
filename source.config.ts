import { defineConfig } from "fumadocs-mdx/config";
import { parseCodeBlockAttributes } from "fumadocs-core/mdx-plugins";

export default defineConfig({
  mdxOptions: {
    rehypeCodeOptions: {
      addLanguageClass: true,
      parseMetaString(meta) {
        const parsed = parseCodeBlockAttributes(meta, [
          "title",
          "tab",
          "noCopy",
          "lineNumbers",
          "lines",
        ]);
        const data: Record<string, boolean | number | string> = {};
        for (const [key, value] of Object.entries(parsed.attributes)) {
          if (key === "noCopy") {
            data.allowCopy = "false";
          } else if (key === "lineNumbers") {
            data["data-line-numbers"] = true;
            if (typeof value === "number") {
              data["data-line-numbers-start"] = value;
            }
          } else if (key === "lines") {
            data["data-code-lines"] = Number(value);
          } else if (value !== null) {
            data[key] = value;
          }
        }
        return data;
      },
      transformers: [
        {
          name: "turboism:code-metadata",
          pre(node) {
            node.properties["data-code-lines"] = this.source.length === 0
              ? 0
              : this.source.split("\n").length;
            node.properties["data-code-language"] = this.options.lang;
          },
        },
      ],
      themes: {
        light: "github-light",
        dark: "github-dark",
      },
    },
  },
});
