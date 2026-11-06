import type { fr } from './fr';

type Widen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Widen<U>[]
    : T extends object
      ? { -readonly [K in keyof T]: Widen<T[K]> }
      : T;

/** Structure imposée à toutes les langues, dérivée du dictionnaire français. */
export type Dict = Widen<typeof fr>;
export type Lang = 'fr' | 'en';
