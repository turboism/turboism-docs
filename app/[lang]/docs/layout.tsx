import { notFound } from "next/navigation";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { source } from "@/lib/source";
import { baseOptions } from "@/lib/layout.shared";
import { isLanguage } from "@/lib/i18n";

export default async function Layout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();

  return (
    <DocsLayout
      {...baseOptions(lang)}
      tree={source.getPageTree(lang)}
      nav={{ enabled: false }}
      sidebar={{ className: "bg-white/60 backdrop-blur-md" }}
      containerProps={{ className: "bg-transparent" }}
    >
      {children}
    </DocsLayout>
  );
}
