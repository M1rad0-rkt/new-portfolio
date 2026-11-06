import { useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { profile, whatsappHref } from '../data/profile';
import { GithubMark, LinkedinMark } from '../lib/BrandIcons';
import { IconCheck, IconCopy, IconExternal, IconMail, IconPin } from '../lib/icons';
import { Reveal } from './Reveal';
import { Txt } from '../admin/Tools';
import { SectionHead } from './SectionHead';

export function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const hasGoogle = Boolean(profile.googleFormUrl);
  const hasWhatsapp = Boolean(profile.whatsapp);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact-title" index="06" kicker={c.kicker} title={c.title} subtitle={<Txt k="contact.subtitle" />} />

        <div className="contact">
          <Reveal className="contact__info">
            <ul className="contact__list">
              <li>
                <span className="mono contact__label">
                  <IconMail size={16} />
                  {c.email}
                </span>
                <span className="contact__row">
                  <a className="contact__mail" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  <button type="button" className="btn btn--tiny" onClick={copyEmail} aria-label={c.copyLabel}>
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    <span aria-live="polite">{copied ? c.copied : c.copy}</span>
                  </button>
                </span>
              </li>
              {profile.phone ? (
                <li>
                  <span className="mono contact__label">{c.phone}</span>
                  <span className="contact__value">
                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                  </span>
                </li>
              ) : null}
              <li>
                <span className="mono contact__label">
                  <IconPin size={16} />
                  {c.location}
                </span>
                <span className="contact__value">{c.locationValue}</span>
              </li>
            </ul>

            <div className="contact__social">
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
            </div>
          </Reveal>

          <Reveal className="contact__form" delay={100}>
            <h3 className="contact__form-title">{c.googleTitle}</h3>
            <p className="contact__note">{c.googleNote}</p>

            <div className="contact__cta-row">
              {hasGoogle ? (
                <a
                  className="btn btn--solid"
                  href={profile.googleFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.googleOpen}
                  <IconExternal size={16} />
                </a>
              ) : (
                <a className="btn btn--solid" href={`mailto:${profile.email}`}>
                  <IconMail size={18} />
                  {profile.email}
                </a>
              )}

              {hasWhatsapp ? (
                <a
                  className="btn btn--line contact__wa"
                  href={whatsappHref(c.whatsappPrefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.whatsappCta}
                  <IconExternal size={16} />
                </a>
              ) : null}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}