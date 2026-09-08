'use client';
import { BrandHeader } from '@/brand/shell';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useLanguage } from '@/components/language-provider';
export function SiteHeader() { const { language } = useLanguage(); return <BrandHeader active="docs" locale={language} languageControl={<LanguageSwitcher language={language}/>}/>; }
