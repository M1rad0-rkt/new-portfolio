import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}

/** Apparition progressive au scroll (fondu + léger glissement). */
export function Reveal({ children, as: Tag = 'div', delay = 0, className = '' }: RevealProps) {
  const [ref, shown] = useReveal<HTMLElement>();
  const style = { '--reveal-delay': `${delay}ms` } as CSSProperties;
  return (
    <Tag ref={ref} className={`reveal ${shown ? 'is-in' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
