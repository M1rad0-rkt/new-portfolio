import { useState } from 'react';
import { useAdmin } from './AdminProvider';
import { useContent } from '../content/ContentProvider';
import { IconEdit, IconDownload } from '../lib/icons';

/** Barre fixe affichée en bas quand l'administrateur est connecté. */
export function AdminBar() {
  const { isAdmin, editing, setEditing, logout } = useAdmin();
  const { imported, source, error, importSeed } = useContent();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isAdmin) return null;

  async function runImport() {
    setBusy(true);
    setMsg('');
    try {
      await importSeed();
      setEditing(true);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Import impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="adminbar" role="region" aria-label="Administration">
      <span className="adminbar__tag mono">Admin</span>

      {source === 'error' ? (
        <span className="adminbar__msg" role="alert">
          Lecture impossible : {error}. As-tu exécuté supabase/schema.sql ?
        </span>
      ) : !imported ? (
        <>
          <span className="adminbar__msg">La base est vide : importe d’abord le contenu actuel du site.</span>
          <button type="button" className="btn btn--solid btn--tiny" onClick={runImport} disabled={busy}>
            <IconDownload size={14} />
            {busy ? 'Import…' : 'Importer le contenu initial'}
          </button>
        </>
      ) : (
        <button
          type="button"
          className={`btn btn--tiny ${editing ? 'btn--solid' : 'btn--line'}`}
          aria-pressed={editing}
          onClick={() => setEditing(!editing)}
        >
          <IconEdit size={14} />
          Mode édition : {editing ? 'activé' : 'désactivé'}
        </button>
      )}

      {msg ? (
        <span className="adminbar__msg" role="alert">
          {msg}
        </span>
      ) : null}
      <button type="button" className="btn btn--tiny btn--line" onClick={() => void logout()}>
        Déconnexion
      </button>
    </div>
  );
}
