import { useContent } from '../content/ContentProvider';
import { useAdmin } from './AdminProvider';

/** Les outils d'édition ne s'affichent que si : admin connecté + mode édition + contenu déjà en base. */
export function useCanEdit(): boolean {
  const { isAdmin, editing } = useAdmin();
  const { imported, source } = useContent();
  return isAdmin && editing && imported && source === 'live';
}
