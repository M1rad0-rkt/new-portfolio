import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAdmin } from '../admin/AdminProvider';

export interface Review {
  id: string;
  name: string;
  role: string | null;
  rating: number;
  message: string;
  approved: boolean;
  created_at: string;
}

export interface ReviewInput {
  name: string;
  role: string | null;
  rating: number;
  message: string;
}

const COLUMNS = 'id,name,role,rating,message,approved,created_at';

/**
 * Avis des visiteurs.
 * - visiteur : ne reçoit que les avis validés (et la base l'impose, via RLS) ;
 * - admin    : reçoit tout, peut valider / masquer / supprimer.
 */
export function useReviews() {
  const { isAdmin } = useAdmin();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    if (!supabase) return;
    let q = supabase.from('reviews').select(COLUMNS).order('created_at', { ascending: false });
    if (!isAdmin) q = q.eq('approved', true);
    const { data, error: err } = await q;
    if (err) {
      setError(true);
      setReviews([]);
    } else {
      setError(false);
      setReviews((data ?? []) as Review[]);
    }
    setLoading(false);
  }, [isAdmin]);

  useEffect(() => {
    void load();
  }, [load]);

  /** Dépôt d'un avis : créé « non validé » par la base. */
  const submit = useCallback(async (input: ReviewInput) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { error: err } = await supabase.from('reviews').insert(input);
    if (err) throw new Error(err.message);
  }, []);

  const setApproved = useCallback(async (id: string, approved: boolean) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { data, error: err } = await supabase.from('reviews').update({ approved }).eq('id', id).select('id');
    if (err || !data?.length) throw new Error('Modification refusée (êtes-vous connecté en administrateur ?).');
    setReviews((rs) => rs.map((r) => (r.id === id ? { ...r, approved } : r)));
  }, []);

  const remove = useCallback(async (id: string) => {
    if (!supabase) throw new Error('Supabase non configuré');
    const { data, error: err } = await supabase.from('reviews').delete().eq('id', id).select('id');
    if (err || !data?.length) throw new Error('Suppression refusée (êtes-vous connecté en administrateur ?).');
    setReviews((rs) => rs.filter((r) => r.id !== id));
  }, []);

  return { reviews, loading, error, submit, setApproved, remove };
}
