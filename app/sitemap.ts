import type { MetadataRoute } from "next";
import { source } from "@/lib/source";
import { languages } from "@/lib/i18n";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://turboism.dev/docs";
  return [
    ...languages.map((lang) => ({ url: `${baseUrl}/${lang}`, lastModified: new Date() })),
    ...languages.flatMap((lang) =>
      source.getPages(lang).map((page) => ({
        url: `${baseUrl}${page.url}`,
        lastModified: new Date(),
      })),
    ),
    { url: `${baseUrl}/sdk/index.html`, lastModified: new Date() },
  ];
}
