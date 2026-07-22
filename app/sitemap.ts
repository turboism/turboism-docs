import type { MetadataRoute } from "next";
import { documents } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://docs.turboism.dev";
  return [
    { url: baseUrl, lastModified: new Date() },
    ...documents.map((document) => ({
      url: `${baseUrl}/${document.slug}`,
      lastModified: new Date(),
    })),
  ];
}
