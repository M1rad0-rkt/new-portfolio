import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { Lang } from '../i18n/types';
import { isSeedId, seedRows } from './seed';
import { defaultText } from './texts';
import type { Collection, Entry, L, Row, TextData } from './types';

type Source = 'static' | 'loading' | 'live' | 'error';
const COLUMNS = 'id,collection,position,data';

interface ContentValue {
  source: Source;
  /** true quand le contenu vient de la base (et non du contenu initial embarqué). */
  imported: boolean;
  error: string;
  list: <T>(collection: Collection) => Entry<T>[];
  text: (key: string, lang: Lang) => string;
  textOverride: (key: string) => L | undefined;
  save: (collection: Collection, id: string | null, data: Record<string, unknown>) => Promise<void>;
  saveText: (key: string, value: L) => Promise<void>;
  remove: (id: string) => Promise<void>;
  move: (collection: Collection, id: string, dir: -1 | 1) => Promise<void>;
  importSeed: () => Promise<void>;
  reload: () => Promise<void>;
}

const ContentContext = createContext<ContentValue | null>(null);

const needDb = () => {
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  return supabase;
};
const sortRows = (rows: Row[]) => [...rows].sort((a, b) => a.position - b.position);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [rows, setRows] = useState<Row[]>(seedRows);
  const [source, setSource] = useState<Source>(supabase ? 'loading' : 'static');
  const [imported, setImported] = useState(false);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (!supabase) return;
    const { data, error: err } = await supabase.from('entries').select(COLUMNS).order('position');
    if (err) {
      setSource('error');
      setError(err.message);
      return; // on garde le contenu initial affiché
    }
    const db = (data ?? []) as Row[];
    const hasContent = db.some((r) => r.collection !== 'texts');
    setImported(hasContent);
    // Base encore vide : on affiche le contenu initial (+ d'éventuels textes déjà enregistrés).
    setRows(hasContent ? db : [...seedRows(), ...db.filter((r) => r.collection === 'texts')]);
    setSource('live');
    setError('');
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const list = useCallback(
    <T,>(collection: Collection) =>
      sortRows(rows.filter((r) => r.collection === collection)).map(
        (r) => ({ id: r.id, position: r.position, data: r.data as T }) satisfies Entry<T>,
      ),
    [rows],
  );

  const textOverride = useCallback(
    (key: string) => {
      const row = rows.find((r) => r.collection === 'texts' && (r.data as unknown as TextData).key === key);
      return row ? (row.data as unknown as TextData).value : undefined;
    },
    [rows],
  );

  const text = useCallback(
    (key: string, lang: Lang) => textOverride(key)?.[lang] || defaultText(key, lang),
    [textOverride],
  );

  const save = useCallback(
    async (collection: Collection, id: string | null, data: Record<string, unknown>) => {
      const db = needDb();
      if (id && !isSeedId(id)) {
        const { data: out, error: err } = await db.from('entries').update({ data }).eq('id', id).select(COLUMNS);
        if (err) throw err;
        if (!out?.length) throw new Error('Aucune modification enregistrée : ce compte n’est pas administrateur.');
        setRows((prev) => prev.map((r) => (r.id === id ? (out[0] as Row) : r)));
        return;
      }
      const position =
        rows.filter((r) => r.collection === collection).reduce((m, r) => Math.max(m, r.position), -1) + 1;
      const { data: out, error: err } = await db
        .from('entries')
        .insert({ collection, position, data })
        .select(COLUMNS);
      if (err) throw err;
      if (!out?.length) throw new Error('Ajout refusé : ce compte n’est pas administrateur.');
      setRows((prev) => [...prev, out[0] as Row]);
    },
    [rows],
  );

  const saveText = useCallback(
    async (key: string, value: L) => {
      const existing = rows.find((r) => r.collection === 'texts' && (r.data as unknown as TextData).key === key);
      await save('texts', existing?.id ?? null, { key, value });
    },
    [rows, save],
  );

  const remove = useCallback(async (id: string) => {
    const db = needDb();
    const { data: out, error: err } = await db.from('entries').delete().eq('id', id).select('id');
    if (err) throw err;
    if (!out?.length) throw new Error('Suppression refusée : ce compte n’est pas administrateur.');
    setRows((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const move = useCallback(
    async (collection: Collection, id: string, dir: -1 | 1) => {
      const db = needDb();
      const ordered = sortRows(rows.filter((r) => r.collection === collection));
      const from = ordered.findIndex((r) => r.id === id);
      const to = from + dir;
      if (from < 0 || to < 0 || to >= ordered.length) return;
      [ordered[from], ordered[to]] = [ordered[to], ordered[from]];
      const changed = ordered
        .map((r, position) => ({ r, position }))
        .filter(({ r, position }) => r.position !== position);
      const results = await Promise.all(
        changed.map(({ r, position }) =>
          db.from('entries').update({ position }).eq('id', r.id).select(COLUMNS),
        ),
      );
      const failed = results.find((x) => x.error || !x.data?.length);
      if (failed) throw failed.error ?? new Error('Réorganisation refusée.');
      const byId = new Map(changed.map(({ r, position }) => [r.id, position]));
      setRows((prev) => prev.map((r) => (byId.has(r.id) ? { ...r, position: byId.get(r.id)! } : r)));
    },
    [rows],
  );

  const importSeed = useCallback(async () => {
    const db = needDb();
    const payload = seedRows().map(({ collection, position, data }) => ({ collection, position, data }));
    const { data: out, error: err } = await db.from('entries').insert(payload).select(COLUMNS);
    if (err) throw err;
    if (!out?.length) throw new Error('Import refusé : ce compte n’est pas administrateur.');
    setRows((prev) => [...(out as Row[]), ...prev.filter((r) => r.collection === 'texts')]);
    setImported(true);
  }, []);

  const value = useMemo<ContentValue>(
    () => ({ source, imported, error, list, text, textOverride, save, saveText, remove, move, importSeed, reload }),
    [source, imported, error, list, text, textOverride, save, saveText, remove, move, importSeed, reload],
  );
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentValue {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent doit être utilisé dans <ContentProvider>');
  return ctx;
}
