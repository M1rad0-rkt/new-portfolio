import type { ComponentType } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useContent } from '../content/ContentProvider';
import { pick, type SkillData, type SkillIcon } from '../content/types';
import { AddEntry, ItemTools } from '../admin/Tools';
import { IconAnalytics, IconBulb, IconCode, IconLayers } from '../lib/icons';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

const ICONS: Record<SkillIcon, ComponentType<{ size?: number }>> = {
  data: IconAnalytics,
  ai: IconBulb,
  web: IconCode,
  tools: IconLayers,
};

export function Skills() {
  const { t, lang } = useI18n();
  const s = t.skills;
  const cats = useContent().list<SkillData>('skills');
  const all = cats.flatMap((c) => c.data.items ?? []);

  return (
    <section id="skills" className="section" aria-labelledby="skills-title">
      <div className="wrap">
        <SectionHead id="skills-title" index="03" kicker={s.kicker} title={s.title} subtitle={s.subtitle} />

        <div className="skills">
          {cats.map((cat, i) => {
            const Icon = ICONS[cat.data.icon] ?? IconLayers;
            const title = pick(cat.data.title, lang);
            return (
              <Reveal key={cat.id} as="article" className={`skill skill--${cat.data.icon}`} delay={i * 70}>
                <header className="skill__head">
                  <span className="skill__num mono">0{i + 1}</span>
                  <Icon size={22} />
                </header>
                <h3 className="skill__title">{title}</h3>
                <ul className="chips chips--mono">
                  {(cat.data.items ?? []).map((name) => (
                    <li key={name} className="chip">
                      {name}
                    </li>
                  ))}
                </ul>
                <ItemTools collection="skills" entry={cat} index={i} count={cats.length} label={title} />
              </Reveal>
            );
          })}
        </div>
        <AddEntry collection="skills" label="Ajouter une catégorie" />
      </div>

      {all.length ? (
        <div className="ticker-wrap">
          <div className="ticker" role="img" aria-label={s.caption}>
            <div className="ticker__track" aria-hidden="true">
              {[0, 1].map((dup) => (
                <ul key={dup} className="ticker__list">
                  {all.map((name, k) => (
                    <li key={`${dup}-${k}-${name}`}>
                      {name}
                      <span className="ticker__star">✺</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
