import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { isLanguage } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLanguage(lang)) return {};

  return {
    alternates: {
      canonical: `/docs/${lang}`,
      languages: {
        en: "/docs/en",
        zh: "/docs/zh",
        ja: "/docs/ja",
      },
    },
  };
}

export default async function HomePageLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  if (!isLanguage(lang)) notFound();
  return <HomeLayout {...baseOptions(lang)} nav={{ enabled: false }}>{children}</HomeLayout>;
}
