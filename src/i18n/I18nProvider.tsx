import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fr } from './fr';
import { en } from './en';
import type { Dict, Lang } from './types';

const DICTS: Record<Lang, Dict> = { fr: fr as unknown as Dict, en };
const STORAGE_KEY = 'mirado.lang';

interface I18nValue {
  lang: Lang;
  t: Dict;
  setLang: (lang: Lang) => void;
}

const I18nContext = createContext<I18nValue | null>(null);

function initialLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch {
    /* stockage indisponible */
  }
  if (typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')) return 'en';
  return 'fr';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignoré */
    }
  }, []);

  useEffect(() => {
    const dict = DICTS[lang];
    document.documentElement.lang = lang;
    document.title = dict.meta.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', dict.meta.description);
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', dict.meta.title);
    document
      .querySelector('meta[property="og:description"]')
      ?.setAttribute('content', dict.meta.description);
    document
      .querySelector('meta[property="og:locale"]')
      ?.setAttribute('content', lang === 'fr' ? 'fr_FR' : 'en_US');
  }, [lang]);

  const value = useMemo<I18nValue>(() => ({ lang, t: DICTS[lang], setLang }), [lang, setLang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé dans <I18nProvider>');
  return ctx;
}
