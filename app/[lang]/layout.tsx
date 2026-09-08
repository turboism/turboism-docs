import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { brandFontVariables } from '@/brand/fonts';
import { RootProvider } from "fumadocs-ui/provider/next";
import { LanguageProvider } from "@/components/language-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { languages, isLanguage } from "@/lib/i18n";
import { providerOptions } from "@/lib/layout.shared";
export const metadata: Metadata = { metadataBase: new URL("https://turboism.dev"), title: { default: "Turboism Docs", template: "%s · Turboism Docs" }, description: "The authoritative product and developer documentation for Turboism." };
export function generateStaticParams() { return languages.map((lang) => ({ lang })); }
export default async function LanguageLayout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }>; }>) {
 const { lang } = await params; if (!isLanguage(lang)) notFound();
 return <html lang={lang} className={brandFontVariables} suppressHydrationWarning><body className="flex min-h-screen flex-col"><LanguageProvider language={lang}><RootProvider i18n={providerOptions(lang)} theme={{ enabled: false }}><SiteHeader/><div className="pt-20 flex-1">{children}</div><SiteFooter/></RootProvider></LanguageProvider></body></html>;
}
