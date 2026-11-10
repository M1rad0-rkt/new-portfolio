import { useEffect, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useTheme } from '../hooks/useTheme';
import { useActiveSection } from '../hooks/useActiveSection';
import { useScrolled } from '../hooks/useScrolled';
import { useAdmin } from '../admin/AdminProvider';
import { IconClose, IconEdit, IconLock, IconMenu, IconMoon, IconSun } from '../lib/icons';
import type { Lang } from '../i18n/types';

const SECTIONS = ['home', 'about', 'journey', 'skills', 'projects', 'reviews', 'contact'] as const;
const TRACKED = [...SECTIONS.slice(0, 5), 'services', 'reviews', 'contact'];

export function Nav() {
  const { t, lang, setLang } = useI18n();
  const { theme, toggle } = useTheme();
  const admin = useAdmin();
  const scrolled = useScrolled();
  const active = useActiveSection(TRACKED);
  // La section Avis n'existe que si Supabase est configuré.
  const links = SECTIONS.filter((id) => id !== 'reviews' || admin.configured);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const current = active === 'services' ? 'projects' : active;
  const themeLabel = theme === 'dark' ? t.a11y.switchToLight : t.a11y.switchToDark;

  const langSwitch = (
    <div className="seg" role="group" aria-label={t.a11y.language}>
      {(['fr', 'en'] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          className="seg__btn mono"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );

  const themeBtn = (
    <button type="button" className="icon-btn" onClick={toggle} aria-label={themeLabel} title={themeLabel}>
      {theme === 'dark' ? <IconSun size={20} /> : <IconMoon size={20} />}
    </button>
  );

  const adminBtn = admin.configured ? (
    <button
      type="button"
      className={`icon-btn ${admin.isAdmin && admin.editing ? 'is-on' : ''}`}
      onClick={() => (admin.isAdmin ? admin.setEditing(!admin.editing) : admin.setLoginOpen(true))}
      aria-label={admin.isAdmin ? t.a11y.adminEdit : t.a11y.adminLogin}
      aria-pressed={admin.isAdmin ? admin.editing : undefined}
      title={admin.isAdmin ? t.a11y.adminEdit : t.a11y.adminLogin}
    >
      {admin.isAdmin ? <IconEdit size={20} /> : <IconLock size={20} />}
    </button>
  ) : null;

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="nav__bar wrap">
        <a href="#home" className="logo" aria-label="MIRADO — home" onClick={() => setOpen(false)}>
          <span className="logo__dot" aria-hidden="true" />
          MIRADO
        </a>

        <nav className="nav__links" aria-label={t.a11y.mainNav}>
          {links.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className="nav__link"
              aria-current={current === id ? 'true' : undefined}
            >
              {t.nav[id]}
            </a>
          ))}
        </nav>

        <div className="nav__tools">
          {langSwitch}
          {themeBtn}
          {adminBtn}
          <button
            type="button"
            className="icon-btn nav__burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.a11y.closeMenu : t.a11y.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
          </button>
        </div>
      </div>

      <div id="mobile-menu" className={`sheet ${open ? 'is-open' : ''}`} hidden={!open}>
        <nav className="sheet__nav wrap" aria-label={t.a11y.mainNav}>
          {links.map((id, i) => (
            <a
              key={id}
              href={`#${id}`}
              className="sheet__link"
              style={{ transitionDelay: `${60 + i * 45}ms` }}
              onClick={() => setOpen(false)}
            >
              <span className="mono">0{i + 1}</span>
              {t.nav[id]}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
