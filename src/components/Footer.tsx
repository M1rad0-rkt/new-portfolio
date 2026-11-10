import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { profile } from '../data/profile';
import { GithubMark, LinkedinMark } from '../lib/BrandIcons';
import { IconCheck, IconCoffee, IconCopy, IconDown, IconMail, IconPin } from '../lib/icons';
import { Txt } from '../admin/Tools';

/** Pied de page : coordonnées de contact (id="contact" = cible du lien « Contact » du menu). */
export function Footer() {
  const { t } = useI18n();
  const c = t.contact;
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible : l'adresse reste visible et cliquable */
    }
  }

  return (
    <footer id="contact" className="footer" aria-labelledby="contact-title">
      <div className="wrap">
        <div className="footer__contact">
          <div className="footer__lead">
            <p className="footer__kicker mono">{c.kicker}</p>
            <h2 id="contact-title" className="footer__title">
              {c.title}
            </h2>
            <p className="footer__sub">
              <Txt k="contact.subtitle" />
            </p>
          </div>

          <ul className="footer__list">
            <li>
              <span className="footer__label mono">
                <IconMail size={16} />
                {c.email}
              </span>
              <span className="footer__row">
                <a className="footer__mail" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <button type="button" className="btn btn--tiny" onClick={copyEmail} aria-label={c.copyLabel}>
                  {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                  <span aria-live="polite">{copied ? c.copied : c.copy}</span>
                </button>
              </span>
            </li>
            <li>
              <span className="footer__label mono">
                <IconPin size={16} />
                {c.location}
              </span>
              <span className="footer__value">{c.locationValue}</span>
            </li>
            <li className="footer__social">
              <a className="btn btn--line" href={profile.github} target="_blank" rel="noopener noreferrer">
                <GithubMark size={18} />
                GitHub
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
              <a className="btn btn--line" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinMark size={18} />
                LinkedIn
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="footer__bar mono">
          <p className="footer__made">
            <IconCoffee size={16} />
            {t.footer.made}
          </p>
          <p>
            © {new Date().getFullYear()} {profile.name} — {t.footer.rights}
          </p>
          <a className="footer__top" href="#home">
            {t.a11y.backToTop}
            <span className="footer__up" aria-hidden="true">
              <IconDown size={16} />
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
