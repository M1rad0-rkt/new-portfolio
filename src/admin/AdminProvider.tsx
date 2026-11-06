import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Collection, Entry } from '../content/types';

export interface EditorTarget {
  collection: Collection;
  /** Fiche à modifier ; absente = création. */
  entry?: Entry | null;
  /** Pour la collection « texts » : clé du texte (ex. hero.intro). */
  textKey?: string;
}

interface AdminValue {
  /** Supabase est-il configuré ? Sinon le bouton admin n'apparaît pas. */
  configured: boolean;
  user: User | null;
  isAdmin: boolean;
  editing: boolean;
  setEditing: (v: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginOpen: boolean;
  setLoginOpen: (v: boolean) => void;
  editor: EditorTarget | null;
  openEditor: (t: EditorTarget) => void;
  closeEditor: () => void;
}

const AdminContext = createContext<AdminValue | null>(null);

async function checkAdmin(userId: string): Promise<boolean> {
  if (!supabase) return false;
  const { data, error } = await supabase.from('admins').select('user_id').eq('user_id', userId);
  return !error && Boolean(data?.length);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editing, setEditing] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [editor, setEditor] = useState<EditorTarget | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let alive = true;
    void supabase.auth.getSession().then(({ data }) => alive && setUser(data.session?.user ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let alive = true;
    if (!user) {
      setIsAdmin(false);
      setEditing(false);
      return;
    }
    void checkAdmin(user.id).then((ok) => alive && setIsAdmin(ok));
    return () => {
      alive = false;
    };
  }, [user]);

  useEffect(() => {
    document.documentElement.classList.toggle('is-editing', isAdmin && editing);
  }, [isAdmin, editing]);

  const login = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase n’est pas configuré.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error('Identifiants incorrects.');
    const ok = data.user ? await checkAdmin(data.user.id) : false;
    if (!ok) {
      await supabase.auth.signOut();
      throw new Error('Ce compte n’a pas les droits administrateur.');
    }
    setUser(data.user);
    setIsAdmin(true);
    setEditing(true);
  }, []);

  const logout = useCallback(async () => {
    await supabase?.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    setEditing(false);
  }, []);

  const value = useMemo<AdminValue>(
    () => ({
      configured: Boolean(supabase),
      user,
      isAdmin,
      editing,
      setEditing,
      login,
      logout,
      loginOpen,
      setLoginOpen,
      editor,
      openEditor: setEditor,
      closeEditor: () => setEditor(null),
    }),
    [user, isAdmin, editing, login, logout, loginOpen, editor],
  );
  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin(): AdminValue {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin doit être utilisé dans <AdminProvider>');
  return ctx;
}
