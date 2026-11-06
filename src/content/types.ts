import type { Lang } from '../i18n/types';

/** Texte bilingue. */
export type L = Record<Lang, string>;
/** Liste bilingue (ex. fonctionnalités d'un projet). */
export type LL = Record<Lang, string[]>;

export type Collection = 'projects' | 'gallery' | 'journey' | 'skills' | 'services' | 'texts';

export interface Entry<T = unknown> {
  id: string;
  position: number;
  data: T;
}
export interface Row extends Entry<Record<string, unknown>> {
  collection: Collection;
}

export type PosterVariant = 'sun' | 'grid' | 'waves' | 'rings';
export type SkillIcon = 'data' | 'ai' | 'web' | 'tools';
export type ServiceIcon = 'analysis' | 'ml' | 'aiapps' | 'rag' | 'fullstack';

export interface ProjectData {
  name: string;
  image: string;
  stack: string[];
  github: string;
  demo: string;
  ongoing: boolean;
  poster: PosterVariant;
  tagline: L;
  role: L;
  year: L;
  problem: L;
  solution: L;
  features: LL;
}
export interface GalleryData {
  title: L;
  desc: L;
  meta: L;
  image: string;
  stack: string[];
  github: string;
}
export interface JourneyData {
  kind: 'work' | 'training';
  ongoing: boolean;
  period: L;
  title: L;
  org: L;
  desc: L;
}
export interface SkillData {
  title: L;
  icon: SkillIcon;
  items: string[];
}
export interface ServiceData {
  title: L;
  desc: L;
  icon: ServiceIcon;
}
export interface TextData {
  key: string;
  value: L;
}

/** Valeur dans la langue demandée, avec repli sur l'autre langue si elle est vide. */
export function pick(l: Partial<L> | undefined, lang: Lang): string {
  return l?.[lang] || l?.fr || l?.en || '';
}
export function pickList(l: Partial<LL> | undefined, lang: Lang): string[] {
  const v = l?.[lang];
  return v && v.length ? v : (l?.fr ?? l?.en ?? []);
}
