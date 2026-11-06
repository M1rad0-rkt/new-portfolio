import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAdmin } from './AdminProvider';
import { profile } from '../data/profile';
import { IconClose, IconLock } from '../lib/icons';

export function LoginDialog() {
  const { loginOpen, setLoginOpen, login } = useAdmin();
  const ref = useRef<HTMLDialogElement>(null);
  const [email, setEmail] = useState<string>(profile.email);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (loginOpen && !dlg.open) dlg.showModal();
    if (!loginOpen && dlg.open) dlg.close();
  }, [loginOpen]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await login(email.trim(), password);
      setPassword('');
      setLoginOpen(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connexion impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <dialog
      ref={ref}
      className="adm-dialog adm-dialog--sm"
      aria-labelledby="login-title"
      onClose={() => setLoginOpen(false)}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <form className="adm-form" onSubmit={submit}>
        <header className="adm-form__head">
          <h2 id="login-title">
            <IconLock size={22} /> Connexion admin
          </h2>
          <button type="button" className="icon-btn" aria-label="Fermer" onClick={() => ref.current?.close()}>
            <IconClose size={20} />
          </button>
        </header>
        <div className="adm-form__body">
          <div className="af">
            <label htmlFor="login-email">E-mail</label>
            <input
              id="login-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="af">
            <label htmlFor="login-pw">Mot de passe</label>
            <input
              id="login-pw"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <footer className="adm-form__foot">
          <p className="adm-form__err" role="alert">
            {error}
          </p>
          <button type="submit" className="btn btn--solid" disabled={busy}>
            {busy ? 'Connexion…' : 'Se connecter'}
          </button>
        </footer>
      </form>
    </dialog>
  );
}
