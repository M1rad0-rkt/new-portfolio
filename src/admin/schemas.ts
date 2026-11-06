import type { Collection } from '../content/types';

export type Field =
  | { key: string; label: string; type: 'text' | 'url' | 'textarea'; required?: boolean; hint?: string }
  | { key: string; label: string; type: 'bool' }
  | { key: string; label: string; type: 'select'; options: { value: string; label: string }[] }
  | { key: string; label: string; type: 'tags'; hint?: string }
  | { key: string; label: string; type: 'image'; folder: string }
  | { key: string; label: string; type: 'l-text' | 'l-textarea'; required?: boolean }
  | { key: string; label: string; type: 'l-lines'; hint?: string };

export interface Schema {
  singular: string;
  fields: Field[];
  empty: () => Record<string, unknown>;
}

const l = () => ({ fr: '', en: '' });
const ll = () => ({ fr: [] as string[], en: [] as string[] });

export const SCHEMAS: Record<Exclude<Collection, 'texts'>, Schema> = {
  projects: {
    singular: 'le projet',
    fields: [
      { key: 'name', label: 'Nom du projet', type: 'text', required: true },
      { key: 'tagline', label: 'Accroche', type: 'l-text' },
      { key: 'role', label: 'Rôle', type: 'l-text' },
      { key: 'year', label: 'Période', type: 'l-text' },
      { key: 'ongoing', label: 'Projet en cours', type: 'bool' },
      { key: 'problem', label: 'Problématique', type: 'l-textarea' },
      { key: 'solution', label: 'Solution développée', type: 'l-textarea' },
      { key: 'features', label: 'Fonctionnalités principales', type: 'l-lines', hint: 'Une par ligne' },
      { key: 'stack', label: 'Technologies', type: 'tags', hint: 'Séparées par des virgules' },
      { key: 'github', label: 'Lien GitHub', type: 'url' },
      { key: 'demo', label: 'Lien de démonstration', type: 'url' },
      { key: 'image', label: 'Capture d’écran', type: 'image', folder: 'projects' },
      {
        key: 'poster',
        label: 'Motif si pas de capture',
        type: 'select',
        options: [
          { value: 'rings', label: 'Anneaux' },
          { value: 'grid', label: 'Grille' },
          { value: 'waves', label: 'Vagues' },
          { value: 'sun', label: 'Soleil' },
        ],
      },
      { key: 'featured', label: 'Mettre en avant', type: 'bool' },
      {
        key: 'status',
        label: 'Statut',
        type: 'select',
        options: [
          { value: 'published', label: 'Publié' },
          { value: 'draft', label: 'Brouillon' },
          { value: 'archived', label: 'Archivé' },
        ],
      },
    ],
    empty: () => ({
      name: '',
      image: '',
      stack: [],
      github: '',
      demo: '',
      ongoing: false,
      poster: 'grid',
      featured: false,
      status: 'published',
      tagline: l(),
      role: l(),
      year: l(),
      problem: l(),
      solution: l(),
      features: ll(),
    }),
  },
  gallery: {
    singular: 'la réalisation',
    fields: [
      { key: 'title', label: 'Titre', type: 'l-text', required: true },
      { key: 'desc', label: 'Description', type: 'l-textarea' },
      { key: 'meta', label: 'Mention (année, statut…)', type: 'l-text' },
      { key: 'stack', label: 'Technologies', type: 'tags', hint: 'Séparées par des virgules' },
      { key: 'github', label: 'Lien GitHub', type: 'url' },
      { key: 'demo', label: 'Lien démo', type: 'url' },
      { key: 'image', label: 'Image (facultatif)', type: 'image', folder: 'gallery' },
      { key: 'featured', label: 'Mettre en avant', type: 'bool' },
    ],
    empty: () => ({ title: l(), desc: l(), meta: l(), image: '', stack: [], github: '', demo: '', featured: false }),
  },
  journey: {
    singular: 'l’étape du parcours',
    fields: [
      { key: 'title', label: 'Intitulé', type: 'l-text', required: true },
      { key: 'org', label: 'Organisme / établissement', type: 'l-text' },
      { key: 'period', label: 'Période', type: 'l-text' },
      { key: 'desc', label: 'Description', type: 'l-textarea' },
      {
        key: 'kind',
        label: 'Type',
        type: 'select',
        options: [
          { value: 'work', label: 'Expérience' },
          { value: 'training', label: 'Formation' },
        ],
      },
      { key: 'ongoing', label: 'En cours', type: 'bool' },
    ],
    empty: () => ({ kind: 'work', ongoing: false, period: l(), title: l(), org: l(), desc: l() }),
  },
  skills: {
    singular: 'la catégorie de compétences',
    fields: [
      { key: 'title', label: 'Nom de la catégorie', type: 'l-text', required: true },
      { key: 'items', label: 'Compétences', type: 'tags', hint: 'Séparées par des virgules' },
      {
        key: 'icon',
        label: 'Icône',
        type: 'select',
        options: [
          { value: 'data', label: 'Données' },
          { value: 'ai', label: 'Intelligence artificielle' },
          { value: 'web', label: 'Web' },
          { value: 'tools', label: 'Outils' },
        ],
      },
    ],
    empty: () => ({ title: l(), icon: 'tools', items: [] }),
  },
  services: {
    singular: 'le domaine',
    fields: [
      { key: 'title', label: 'Titre', type: 'l-text', required: true },
      { key: 'desc', label: 'Description', type: 'l-textarea' },
      {
        key: 'icon',
        label: 'Icône',
        type: 'select',
        options: [
          { value: 'analysis', label: 'Analyse' },
          { value: 'ml', label: 'Machine learning' },
          { value: 'aiapps', label: 'Applications IA' },
          { value: 'rag', label: 'Assistants / RAG' },
          { value: 'fullstack', label: 'Full-stack' },
          { value: 'data', label: 'Data engineering' },
          { value: 'devops', label: 'DevOps' },
        ],
      },
      { key: 'highlight', label: 'Mettre en avant', type: 'bool' },
    ],
    empty: () => ({ title: l(), desc: l(), icon: 'analysis', highlight: false }),
  },
};

type Draft = Record<string, unknown>;
type Pair = { fr: string; en: string };

/** Données stockées → valeurs de formulaire (tout en chaînes). */
export function toDraft(fields: Field[], data: Draft): Draft {
  const out: Draft = {};
  for (const f of fields) {
    const v = data[f.key];
    switch (f.type) {
      case 'bool':
        out[f.key] = Boolean(v);
        break;
      case 'tags':
        out[f.key] = Array.isArray(v) ? v.join(', ') : '';
        break;
      case 'l-text':
      case 'l-textarea': {
        const p = (v ?? {}) as Partial<Pair>;
        out[f.key] = { fr: p.fr ?? '', en: p.en ?? '' };
        break;
      }
      case 'l-lines': {
        const p = (v ?? {}) as { fr?: string[]; en?: string[] };
        out[f.key] = { fr: (p.fr ?? []).join('\n'), en: (p.en ?? []).join('\n') };
        break;
      }
      case 'select':
        out[f.key] = typeof v === 'string' && v ? v : f.options[0].value;
        break;
      default:
        out[f.key] = typeof v === 'string' ? v : '';
    }
  }
  return out;
}

const lines = (s: string) => s.split('\n').map((x) => x.trim()).filter(Boolean);

/** Valeurs de formulaire → données à stocker. */
export function fromDraft(fields: Field[], draft: Draft): Draft {
  const out: Draft = {};
  for (const f of fields) {
    const v = draft[f.key];
    switch (f.type) {
      case 'bool':
        out[f.key] = Boolean(v);
        break;
      case 'tags':
        out[f.key] = String(v ?? '').split(',').map((x) => x.trim()).filter(Boolean);
        break;
      case 'l-text':
      case 'l-textarea': {
        const p = v as Pair;
        out[f.key] = { fr: p.fr.trim(), en: p.en.trim() };
        break;
      }
      case 'l-lines': {
        const p = v as Pair;
        out[f.key] = { fr: lines(p.fr), en: lines(p.en) };
        break;
      }
      default:
        out[f.key] = String(v ?? '').trim();
    }
  }
  return out;
}

export function missingRequired(fields: Field[], draft: Draft): string | null {
  for (const f of fields) {
    if (!('required' in f) || !f.required) continue;
    const v = draft[f.key];
    const empty =
      f.type === 'l-text' || f.type === 'l-textarea'
        ? !(v as Pair).fr.trim() && !(v as Pair).en.trim()
        : !String(v ?? '').trim();
    if (empty) return f.label;
  }
  return null;
}
