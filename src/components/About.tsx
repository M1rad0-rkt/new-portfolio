import { useI18n } from '../i18n/I18nProvider';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { Txt } from '../admin/Tools';

export function About() {
  const { t } = useI18n();
  const a = t.about;
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="wrap">
        <SectionHead id="about-title" index="01" kicker={a.kicker} title={a.title} />
        <div className="about">
          <Reveal className="about__text">
            <Txt k="about.p1" as="p" className="about__lead" />
            <Txt k="about.p2" as="p" />
            <Txt k="about.p3" as="p" />
            <div className="about__out">
              <span className="mono">{a.outside}</span>
              <ul className="chips">
                {a.interests.map((i) => (
                  <li key={i} className="chip">
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal className="about__side" delay={120}>
            <blockquote className="about__quote">
              <span className="about__mark" aria-hidden="true">“</span>
              <Txt k="about.quote" />
            </blockquote>
            <dl className="facts">
              <dt className="mono facts__title">{a.factsTitle}</dt>
              {a.facts.map((f) => (
                <div key={f.label} className="facts__row">
                  <dt className="mono">{f.label}</dt>
                  <dd>{f.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
