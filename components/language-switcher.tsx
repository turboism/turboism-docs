'use client';
import { useSyncExternalStore } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BrandLanguage } from '@/brand/shell';
import { languages, persistLanguage, type Language } from '@/lib/i18n';

const subscribeToHydration = () => () => {};
const clientReady = () => true;
const serverReady = () => false;

export function LanguageSwitcher({ language }: { language: Language }) {
  const pathname = usePathname(); const router = useRouter();
  // Match the server snapshot during hydration. Do not present an enabled
  // button before React has attached the handler, even on a slow connection.
  const ready = useSyncExternalStore(subscribeToHydration, clientReady, serverReady);
  function changeLanguage(next: Language) {
    persistLanguage(next);
    const segments = pathname.split('/');
    if (languages.includes(segments[1] as Language)) segments[1] = next;
    else segments.splice(1, 0, next);
    router.push((segments.join('/') || `/${next}`) + window.location.search + window.location.hash);
  }
  return <fieldset disabled={!ready} aria-busy={!ready} data-language-ready={ready} className="m-0 min-w-0 border-0 p-0 disabled:opacity-60">
    <BrandLanguage locale={language} onChange={changeLanguage}/>
  </fieldset>;
}
