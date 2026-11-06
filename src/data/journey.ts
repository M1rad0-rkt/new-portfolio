export type JourneyId =
  | 'armp'
  | 'devops'
  | 'ideathon'
  | 'master'
  | 'pixelvault'
  | 'licence'
  | 'ministere'
  | 'mairie'
  | 'bac';

/** work = expérience professionnelle · training = formation / diplôme */
export interface JourneyEntry {
  id: JourneyId;
  kind: 'work' | 'training';
  ongoing?: boolean;
}

/** Ordre d'affichage : du plus récent au plus ancien. */
export const journey: JourneyEntry[] = [
  { id: 'armp', kind: 'work', ongoing: true },
  { id: 'devops', kind: 'training' },
  { id: 'ideathon', kind: 'work' },
  { id: 'master', kind: 'training', ongoing: true },
  { id: 'pixelvault', kind: 'work' },
  { id: 'licence', kind: 'training' },
  { id: 'ministere', kind: 'work' },
  { id: 'mairie', kind: 'work' },
  { id: 'bac', kind: 'training' },
];
