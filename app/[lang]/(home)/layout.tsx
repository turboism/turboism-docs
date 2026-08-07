import { notFound } from "next/navigation";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import { baseOptions } from "@/lib/layout.shared";
import { isLanguage } from "@/lib/i18n";

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
