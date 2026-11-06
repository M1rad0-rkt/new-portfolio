import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useContent } from '../content/ContentProvider';
import { pick, pickList, type Entry, type GalleryData, type ProjectData } from '../content/types';
import { AddEntry, ItemTools } from '../admin/Tools';
import { GithubMark } from '../lib/BrandIcons';
import { IconArrowLeft, IconArrowRight, IconClose, IconExternal } from '../lib/icons';
import { Poster } from './Poster';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

const pad = (n: number) => String(n + 1).padStart(2, '0');

function Visual({ project, label, noShot }: { project: ProjectData; label: string; noShot: string }) {
  if (project.image) {
    return <img src={project.image} alt={label} loading="lazy" decoding="async" className="card__img" />;
  }
  return <Poster variant={project.poster ?? 'grid'} label={noShot} />;
}

function CaseStudy({
  items,
  index,
  onClose,
  onStep,
}: {
  items: Entry<ProjectData>[];
  index: number;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const { t, lang } = useI18n();
  const ref = useRef<HTMLDialogElement>(null);
  const entry = items[index];

  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (!dlg.open) dlg.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    ref.current?.scrollTo({ top: 0 });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onStep(1);
      if (e.key === 'ArrowLeft') onStep(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onStep]);

  // Projet supprimé pendant que la fiche était ouverte.
  if (!entry) return null;
  const p = entry.data;
  const status = p.ongoing ? t.projects.status.ongoing : t.projects.status.done;

  return (
    <dialog
      ref={ref}
      className="case"
      aria-labelledby="case-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current) ref.current?.close();
      }}
    >
      <div className="case__inner">
        <div className="case__bar">
          <span className="mono">
            № {pad(index)} / {pad(items.length - 1)}
          </span>
          <div className="case__nav">
            <button type="button" className="icon-btn" onClick={() => onStep(-1)} aria-label={t.a11y.prevProject}>
              <IconArrowLeft size={20} />
            </button>
            <button type="button" className="icon-btn" onClick={() => onStep(1)} aria-label={t.a11y.nextProject}>
              <IconArrowRight size={20} />
            </button>
            <button type="button" className="icon-btn" onClick={() => ref.current?.close()} aria-label={t.a11y.closeDialog}>
              <IconClose size={20} />
            </button>
          </div>
        </div>

        <div className="case__visual">
          <Visual project={p} label={p.name} noShot={t.projects.noScreenshot} />
        </div>

        <h3 id="case-title" className="case__title">
          {p.name}
        </h3>
        <p className="case__tagline">{pick(p.tagline, lang)}</p>

        <dl className="case__meta">
          <div>
            <dt className="mono">{t.projects.role}</dt>
            <dd>{pick(p.role, lang)}</dd>
          </div>
          <div>
            <dt className="mono">{t.projects.year}</dt>
            <dd>{pick(p.year, lang)}</dd>
          </div>
          <div>
            <dt className="mono">Status</dt>
            <dd>
              <span className={`pill ${p.ongoing ? 'pill--live' : ''}`}>{status}</span>
            </dd>
          </div>
        </dl>

        <div className="case__cols">
          <section>
            <h4 className="mono case__h">{t.projects.problem}</h4>
            <p>{pick(p.problem, lang)}</p>
          </section>
          <section>
            <h4 className="mono case__h">{t.projects.solution}</h4>
            <p>{pick(p.solution, lang)}</p>
          </section>
        </div>

        {pickList(p.features, lang).length ? (
          <section>
            <h4 className="mono case__h">{t.projects.features}</h4>
            <ul className="case__list">
              {pickList(p.features, lang).map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {p.stack?.length ? (
          <section>
            <h4 className="mono case__h">{t.projects.stack}</h4>
            <ul className="chips chips--mono">
              {p.stack.map((s) => (
                <li key={s} className="chip">
                  {s}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {p.github || p.demo ? (
          <div className="case__links">
            {p.github ? (
              <a className="btn btn--solid" href={p.github} target="_blank" rel="noopener noreferrer">
                <GithubMark size={18} />
                {t.projects.code}
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
            ) : null}
            {p.demo ? (
              <a className="btn btn--line" href={p.demo} target="_blank" rel="noopener noreferrer">
                {t.projects.demo}
                <IconExternal size={18} />
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
            ) : null}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}

export function Projects() {
  const { t, lang } = useI18n();
  const content = useContent();
  const featured = content.list<ProjectData>('projects');
  const gallery = content.list<GalleryData>('gallery');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const count = featured.length;

  const close = useCallback(() => {
    setOpenIndex(null);
    lastTrigger.current?.focus();
  }, []);

  const step = useCallback(
    (dir: 1 | -1) => {
      setOpenIndex((i) => (i === null || !count ? i : (i + dir + count) % count));
    },
    [count],
  );

  return (
    <>
      <section id="projects" className="section" aria-labelledby="projects-title">
        <div className="wrap">
          <SectionHead
            id="projects-title"
            index="04"
            kicker={t.projects.kicker}
            title={t.projects.title}
            subtitle={t.projects.subtitle}
          />

          <div className="cards">
            {featured.map((e, i) => {
              const p = e.data;
              return (
                <Reveal as="article" key={e.id} className={`card card--${(i % 6) + 1}`} delay={(i % 2) * 90}>
                  <div className="card__visual">
                    <Visual project={p} label={p.name} noShot={t.projects.noScreenshot} />
                    <span className="card__num mono">{pad(i)}</span>
                    {p.ongoing ? (
                      <span className="pill pill--live card__pill">
                        <span className="status__dot" aria-hidden="true" />
                        {t.projects.status.ongoing}
                      </span>
                    ) : null}
                  </div>
                  <div className="card__body">
                    <h3 className="card__title">
                      <button
                        type="button"
                        className="card__hit"
                        onClick={(ev) => {
                          lastTrigger.current = ev.currentTarget;
                          setOpenIndex(i);
                        }}
                      >
                        {p.name}
                      </button>
                    </h3>
                    <p className="card__tag">{pick(p.tagline, lang)}</p>
                    <ul className="chips chips--mono chips--sm">
                      {(p.stack ?? []).slice(0, 4).map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <span className="card__more mono" aria-hidden="true">
                      {t.projects.open}
                      <IconArrowRight size={16} />
                    </span>
                  </div>
                  <ItemTools collection="projects" entry={e} index={i} count={count} label={p.name} />
                </Reveal>
              );
            })}
          </div>
          <AddEntry collection="projects" label="Ajouter un projet" />

          <Reveal className="gallery">
            <div className="gallery__head">
              <h3 className="gallery__title">{t.projects.galleryTitle}</h3>
              <p className="mono">{t.projects.gallerySubtitle}</p>
            </div>
            <ul className="gallery__list">
              {gallery.map((g, i) => {
                const title = pick(g.data.title, lang);
                return (
                  <li key={g.id} className="gallery__row">
                    <span className="mono gallery__n">{pad(i)}</span>
                    <div className="gallery__main">
                      <h4>{title}</h4>
                      <p>{pick(g.data.desc, lang)}</p>
                    </div>
                    <ul className="chips chips--mono chips--sm gallery__stack">
                      {(g.data.stack ?? []).map((s) => (
                        <li key={s} className="chip">
                          {s}
                        </li>
                      ))}
                    </ul>
                    <span className="mono gallery__meta">{pick(g.data.meta, lang)}</span>
                    {g.data.github ? (
                      <a
                        className="icon-btn"
                        href={g.data.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${title} — GitHub ${t.a11y.externalLink}`}
                      >
                        <GithubMark size={18} />
                      </a>
                    ) : (
                      <span className="gallery__spacer" aria-hidden="true" />
                    )}
                    <ItemTools collection="gallery" entry={g} index={i} count={gallery.length} label={title} />
                  </li>
                );
              })}
            </ul>
            <AddEntry collection="gallery" label="Ajouter une réalisation" />
          </Reveal>
        </div>
      </section>

      {openIndex !== null ? <CaseStudy items={featured} index={openIndex} onClose={close} onStep={step} /> : null}
    </>
  );
}
