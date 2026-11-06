import type { ComponentType } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useContent } from '../content/ContentProvider';
import { pick, type ServiceData, type ServiceIcon } from '../content/types';
import { AddEntry, ItemTools } from '../admin/Tools';
import { IconAnalytics, IconBuild, IconChat, IconData, IconLaptop } from '../lib/icons';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

const ICONS: Record<ServiceIcon, ComponentType<{ size?: number }>> = {
  analysis: IconAnalytics,
  ml: IconData,
  aiapps: IconBuild,
  rag: IconChat,
  fullstack: IconLaptop,
};

export function Services() {
  const { t, lang } = useI18n();
  const s = t.services;
  const items = useContent().list<ServiceData>('services');
  return (
    <section id="services" className="section section--tint" aria-labelledby="services-title">
      <div className="wrap">
        <SectionHead id="services-title" index="05" kicker={s.kicker} title={s.title} />
        <ul className="services">
          {items.map((e, i) => {
            const Icon = ICONS[e.data.icon] ?? IconBuild;
            const title = pick(e.data.title, lang);
            return (
              <Reveal as="li" key={e.id} className="service" delay={i * 50}>
                <span className="service__n mono">0{i + 1}</span>
                <h3 className="service__title">{title}</h3>
                <p className="service__desc">{pick(e.data.desc, lang)}</p>
                <span className="service__icon">
                  <Icon size={28} />
                </span>
                <ItemTools collection="services" entry={e} index={i} count={items.length} label={title} />
              </Reveal>
            );
          })}
        </ul>
        <AddEntry collection="services" label="Ajouter un domaine" />
      </div>
    </section>
  );
}
