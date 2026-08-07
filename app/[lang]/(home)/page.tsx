"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

const pathLinks = [
  { key: "use", href: "/docs/use/overview", title: "useTurboismTitle", description: "useTurboismDescription" },
  { key: "plugin", href: "/docs/build-a-plugin/overview", title: "buildPluginTitle", description: "buildPluginDescription" },
  { key: "sdk", href: "/api/sdk/index.html", title: "sdkTitle", description: "sdkDescription" },
] as const;

const startHereLinks = [
  { key: "intro", href: "/docs/introduction", label: "introduction" },
  { key: "architecture", href: "/docs/concepts/architecture", label: "architecture" },
  { key: "preview", href: "/docs/documentation-preview", label: "documentationPreview" },
] as const;

type Copy = ReturnType<typeof useLanguage>["copy"];

export default function HomePage() {
  const { language, copy } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-12 px-6 py-20">
      <div className="max-w-2xl text-center">
        <p className="text-sm font-medium text-fd-primary">{copy.home.eyebrow}</p>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-fd-foreground">
          {copy.home.title}
        </h1>
        <p className="mt-4 text-lg text-fd-muted-foreground">{copy.home.description}</p>
      </div>

      <div className="grid w-full max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pathLinks.map((path) => (
          <Link
            key={path.key}
            href={path.href.startsWith("/docs") ? `/${language}${path.href}` : path.href}
            className="rounded-lg border border-fd-border p-6 transition-colors hover:border-fd-primary"
          >
            <h2 className="font-semibold text-fd-foreground">{copy.home[path.title as keyof Copy["home"]]}</h2>
            <p className="mt-2 text-sm text-fd-muted-foreground">
              {copy.home[path.description as keyof Copy["home"]]}
            </p>
          </Link>
        ))}
      </div>

      <div className="text-center">
        <p className="text-sm font-medium text-fd-muted-foreground">{copy.home.startHere}</p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium">
          {startHereLinks.map((link) => (
            <Link
              key={link.key}
              href={`/${language}${link.href}`}
              className="text-fd-primary underline-offset-4 hover:underline"
            >
              {copy.home[link.label as keyof Copy["home"]]}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
