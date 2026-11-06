import { useMemo, useState } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useContent } from '../content/ContentProvider';
import { pick, type JourneyData } from '../content/types';
import { AddEntry, ItemTools } from '../admin/Tools';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

type Filter = 'all' | 'work' | 'training';

export function Journey() {
  const { t, lang } = useI18n();
  const j = t.journey;
  const all = useContent().list<JourneyData>('journey');
  const [filter, setFilter] = useState<Filter>('all');

  const entries = useMemo(() => all.filter((e) => filter === 'all' || e.data.kind === filter), [all, filter]);

  return (
    <section id="journey" className="section section--tint" aria-labelledby="journey-title">
      <div className="wrap">
        <SectionHead id="journey-title" index="02" kicker={j.kicker} title={j.title} subtitle={j.subtitle} />

        <div className="seg seg--wide" role="group" aria-label={j.filterLabel}>
          {(['all', 'work', 'training'] as Filter[]).map((f) => (
            <button key={f} type="button" className="seg__btn" aria-pressed={filter === f} onClick={() => setFilter(f)}>
              {j.filters[f]}
            </button>
          ))}
        </div>

        <ol className="ledger">
          {entries.map((e, i) => {
            const title = pick(e.data.title, lang);
            const desc = pick(e.data.desc, lang);
            return (
              <Reveal as="li" key={e.id} className="ledger__row" delay={Math.min(i, 4) * 50}>
                <p className="ledger__period">
                  {e.data.ongoing ? <span className="status__dot" aria-hidden="true" /> : null}
                  {pick(e.data.period, lang)}
                </p>
                <div className="ledger__body">
                  <h3 className="ledger__title">{title}</h3>
                  <p className="ledger__org mono">{pick(e.data.org, lang)}</p>
                  {desc ? <p className="ledger__desc">{desc}</p> : null}
                </div>
                <span className="ledger__kind mono" aria-hidden="true">
                  {e.data.kind === 'work' ? j.filters.work : j.filters.training}
                </span>
                <ItemTools collection="journey" entry={e} index={all.indexOf(e)} count={all.length} label={title} />
              </Reveal>
            );
          })}
        </ol>
        <AddEntry collection="journey" label="Ajouter une étape" />
      </div>
    </section>
  );
}
