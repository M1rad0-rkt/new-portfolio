import { useI18n } from '../i18n/I18nProvider';
import { profile } from '../data/profile';
import { IconDown } from '../lib/icons';

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="footer">
      <div className="wrap footer__grid">
        <p className="footer__mark" aria-hidden="true">
          MIRADO
        </p>
        <div className="footer__meta mono">
          <p>{t.footer.built}</p>
          <p>
            © {new Date().getFullYear()} {profile.name} — {t.footer.rights}
          </p>
        </div>
        <a className="footer__top mono" href="#home">
          {t.a11y.backToTop}
          <span className="footer__up" aria-hidden="true">
            <IconDown size={16} />
          </span>
        </a>
      </div>
    </footer>
  );
}
