import { AdminBar } from './AdminBar';
import { EntryEditor } from './EntryEditor';
import { LoginDialog } from './LoginDialog';
import { useAdmin } from './AdminProvider';

/** Tout ce qui est propre à l'administration ; ne rend rien si Supabase n'est pas configuré. */
export function AdminUI() {
  const { configured } = useAdmin();
  if (!configured) return null;
  return (
    <>
      <LoginDialog />
      <AdminBar />
      <EntryEditor />
    </>
  );
}
