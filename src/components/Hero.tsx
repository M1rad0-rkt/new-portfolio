import { useI18n } from '../i18n/I18nProvider';
import { profile } from '../data/profile';
import { IconDown, IconDownload, IconPin, IconArrowRight } from '../lib/icons';
import { GithubMark, LinkedinMark } from '../lib/BrandIcons';
import { Txt } from '../admin/Tools';

function Sun({ badge, label }: { badge: string; label: string }) {
  const ring = badge.repeat(4);
  return (
    <svg className="sun" viewBox="0 0 440 440" role="img" aria-label={label} focusable="false">
      <defs>
        <linearGradient id="sunGrad" x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" style={{ stopColor: 'var(--amber)' }} />
          <stop offset="0.38" style={{ stopColor: 'var(--g1)' }} />
          <stop offset="0.72" style={{ stopColor: 'var(--g2)' }} />
          <stop offset="1" style={{ stopColor: 'var(--g3)' }} />
        </linearGradient>
        <clipPath id="portraitClip">
          <circle cx="220" cy="220" r="142" />
        </clipPath>
        <path id="ringPath" d="M220,220 m-196,0 a196,196 0 1,1 392,0 a196,196 0 1,1 -392,0" />
      </defs>

      <circle cx="220" cy="220" r="208" fill="none" stroke="var(--line-strong)" strokeWidth="1" />
      <g className="sun__spin">
        <text className="sun__ring-text">
          <textPath href="#ringPath" startOffset="0">
            {ring}
          </textPath>
        </text>
      </g>
      <circle cx="220" cy="220" r="150" fill="url(#sunGrad)" />
      <image
        href="/projects/mirado.jpg"
        x="30"
        y="40"
        width="380"
        height="385"
        preserveAspectRatio="xMidYMid slice"
        clipPath="url(#portraitClip)"
      />
      <circle cx="220" cy="220" r="150" fill="none" stroke="var(--ink)" strokeWidth="1" />
      <g stroke="var(--ink)" strokeWidth="1" opacity="0.7">
        <path d="M220 20v22M220 398v22M20 220h22M398 220h22" />
      </g>
    </svg>
  );
}

export function Hero() {
  const { t } = useI18n();

  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="wrap hero__grid">
        <div className="hero__top mono">
          <span>{t.hero.issue}</span>
          <span className="hero__top-rule" aria-hidden="true" />
          <span className="hero__loc">
            <IconPin size={14} />
            {t.hero.location}
          </span>
        </div>

        <h1 id="hero-title" tabIndex={-1} className="hero__name" aria-label={profile.name.toUpperCase()}>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__word" style={{ animationDelay: '60ms' }}>
              MIRADO
            </span>
          </span>
          <span className="hero__line" aria-hidden="true">
            <span className="hero__word hero__word--outline" style={{ animationDelay: '170ms' }}>
              RAKOTONIAINA
            </span>
          </span>
        </h1>

        <div className="hero__copy">
          <p className="hero__role mono">{t.hero.role}</p>
          <p className="hero__tag">
            {t.hero.titleA} <em className="grad-text">{t.hero.titleB}</em>
          </p>
          <Txt k="hero.intro" as="p" className="hero__intro" />

          <p className="status">
            <span className="status__dot" aria-hidden="true" />
            <Txt k="hero.status" />
          </p>

          <div className="hero__cta">
            <a className="btn btn--solid" href="#projects">
              {t.hero.ctaProjects}
              <IconArrowRight size={18} />
            </a>
            <a className="btn btn--line" href={profile.cv.href} download={profile.cv.filename}>
              <IconDownload size={18} />
              {t.hero.ctaCv}
            </a>
            <span className="hero__socials">
              <a className="icon-btn" href={profile.github} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${t.a11y.externalLink}`}>
                <GithubMark size={20} />
              </a>
              <a className="icon-btn" href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`LinkedIn ${t.a11y.externalLink}`}>
                <LinkedinMark size={20} />
              </a>
            </span>
          </div>
        </div>

        <div className="hero__art">
          <Sun badge={t.hero.badge} label={`Portrait — ${profile.name}`} />
        </div>

        <a className="hero__scroll mono" href="#about">
          {t.hero.scroll}
          <IconDown size={16} />
        </a>
      </div>
    </section>
  );
}