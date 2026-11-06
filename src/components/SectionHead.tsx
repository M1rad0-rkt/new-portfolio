import type { ReactNode } from 'react';
import { Reveal } from './Reveal';

interface Props {
  index: string;
  kicker: string;
  title: string;
  subtitle?: ReactNode;
  id: string;
}

/** En-tête de section éditorial : numéro, rubrique, grand titre. */
export function SectionHead({ index, kicker, title, subtitle, id }: Props) {
  return (
    <Reveal as="header" className="sec-head">
      <p className="sec-head__meta">
        <span className="mono">№ {index}</span>
        <span className="sec-head__rule" aria-hidden="true" />
        <span className="mono">{kicker}</span>
      </p>
      <h2 id={id} className="sec-head__title">
        {title}
      </h2>
      {subtitle ? <p className="sec-head__sub">{subtitle}</p> : null}
    </Reveal>
  );
}
