import { fr } from '../i18n/fr';
import { en } from '../i18n/en';
import type { Lang } from '../i18n/types';

/** Textes des dictionnaires modifiables depuis l'interface admin. */
export const EDITABLE_TEXTS = [
  'hero.intro',
  'hero.status',
  'about.p1',
  'about.p2',
  'about.p3',
  'about.quote',
  'contact.subtitle',
] as const;
export type TextKey = (typeof EDITABLE_TEXTS)[number];

export const TEXT_LABELS: Record<TextKey, string> = {
  'hero.intro': 'Hero — présentation',
  'hero.status': 'Hero — statut',
  'about.p1': 'À propos — paragraphe 1 (accroche)',
  'about.p2': 'À propos — paragraphe 2',
  'about.p3': 'À propos — paragraphe 3',
  'about.quote': 'À propos — citation',
  'contact.subtitle': 'Pied de page (contact) — sous-titre',
};

function lookup(dict: unknown, path: string): string {
  let cur: unknown = dict;
  for (const part of path.split('.')) {
    if (cur && typeof cur === 'object') cur = (cur as Record<string, unknown>)[part];
    else return '';
  }
  return typeof cur === 'string' ? cur : '';
}

/** Valeur par défaut (celle des dictionnaires) d'un texte éditable. */
export function defaultText(key: string, lang: Lang): string {
  return lookup(lang === 'fr' ? fr : en, key);
}
