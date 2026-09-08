'use client';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLanguage } from '@/brand/shell';
import { languages, persistLanguage, type Language } from '@/lib/i18n';
export function LanguageSwitcher({ language }: { language: Language }) {
  const pathname = usePathname(); const router = useRouter();
  function changeLanguage(next: Language) {
    persistLanguage(next);
    const segments = pathname.split('/');
    if (languages.includes(segments[1] as Language)) segments[1] = next;
    else segments.splice(1, 0, next);
    router.push(segments.join('/') || `/${next}`);
  }
  return <BrandLanguage locale={language} onChange={changeLanguage}/>;
}
