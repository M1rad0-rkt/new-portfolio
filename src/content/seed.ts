/**
 * Contenu initial : construit à partir des données et dictionnaires du projet.
 * Il sert (1) de contenu affiché tant que Supabase n'est pas configuré ou vide,
 * (2) de source pour le bouton admin « Importer le contenu initial ».
 */
import { fr } from '../i18n/fr';
import { en } from '../i18n/en';
import { featured, gallery } from '../data/projects';
import { journey } from '../data/journey';
import { skills, skillOrder } from '../data/skills';
import type {
  Collection,
  GalleryData,
  JourneyData,
  ProjectData,
  Row,
  ServiceData,
  ServiceIcon,
  SkillData,
} from './types';

const both = (f: string, e: string) => ({ fr: f, en: e });
const SERVICE_IDS: ServiceIcon[] = ['analysis', 'ml', 'aiapps', 'rag', 'fullstack'];

function projects(): ProjectData[] {
  return featured.map((p) => {
    const f = fr.projects.items[p.id];
    const e = en.projects.items[p.id];
    return {
      name: p.name,
      image: p.image ?? '',
      stack: [...p.stack],
      github: p.github ?? '',
      demo: p.demo ?? '',
      ongoing: Boolean(p.ongoing),
      poster: p.poster,
      tagline: both(f.tagline, e.tagline),
      role: both(f.role, e.role),
      year: both(f.year, e.year),
      problem: both(f.problem, e.problem),
      solution: both(f.solution, e.solution),
      features: { fr: [...f.features], en: [...e.features] },
    };
  });
}

function galleryItems(): GalleryData[] {
  return gallery.map((g) => {
    const f = fr.projects.gallery[g.id];
    const e = en.projects.gallery[g.id];
    return {
      title: both(f.title, e.title),
      desc: both(f.desc, e.desc),
      meta: both(f.meta, e.meta),
      image: g.image ?? '',
      stack: [...g.stack],
      github: g.github ?? '',
    };
  });
}

function journeyItems(): JourneyData[] {
  return journey.map((j) => {
    const f = fr.journey.items[j.id];
    const e = en.journey.items[j.id];
    return {
      kind: j.kind,
      ongoing: Boolean(j.ongoing),
      period: both(f.period, e.period),
      title: both(f.title, e.title),
      org: both(f.org, e.org),
      desc: both(f.desc, e.desc),
    };
  });
}

function skillItems(): SkillData[] {
  return skillOrder.map((cat) => ({
    title: both(fr.skills.categories[cat], en.skills.categories[cat]),
    icon: cat,
    items: [...skills[cat]],
  }));
}

function serviceItems(): ServiceData[] {
  return SERVICE_IDS.map((id) => ({
    title: both(fr.services.items[id].title, en.services.items[id].title),
    desc: both(fr.services.items[id].desc, en.services.items[id].desc),
    icon: id,
  }));
}

function toRows(collection: Collection, items: object[]): Row[] {
  return items.map((data, position) => ({
    id: `seed:${collection}:${position}`,
    collection,
    position,
    data: data as Record<string, unknown>,
  }));
}

/** Lignes prêtes à l'affichage (ids « seed:… » = pas encore en base). */
export function seedRows(): Row[] {
  return [
    ...toRows('projects', projects()),
    ...toRows('gallery', galleryItems()),
    ...toRows('journey', journeyItems()),
    ...toRows('skills', skillItems()),
    ...toRows('services', serviceItems()),
  ];
}

export const isSeedId = (id: string) => id.startsWith('seed:');
