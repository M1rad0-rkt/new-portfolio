import type { FeaturedProject } from '../data/projects';

/** Composition graphique de remplacement quand un projet n'a pas de capture publique. */
export function Poster({ variant, label }: { variant: FeaturedProject['poster']; label: string }) {
  return (
    <div className={`poster poster--${variant}`} role="img" aria-label={label}>
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`pg-${variant}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: 'var(--amber)' }} />
            <stop offset="0.5" style={{ stopColor: 'var(--g1)' }} />
            <stop offset="1" style={{ stopColor: 'var(--g3)' }} />
          </linearGradient>
        </defs>
        {variant === 'rings' && (
          <g fill="none" stroke="var(--ink)" strokeWidth="1">
            {[26, 52, 78, 104, 130, 156].map((r) => (
              <circle key={r} cx="270" cy="130" r={r} opacity={0.18 + (160 - r) / 400} />
            ))}
            <circle cx="270" cy="130" r="22" fill={`url(#pg-${variant})`} stroke="none" />
          </g>
        )}
        {variant === 'grid' && (
          <g stroke="var(--ink)" strokeWidth="1" opacity="0.3">
            {Array.from({ length: 11 }).map((_, i) => (
              <path key={`v${i}`} d={`M${i * 40} 0V260`} />
            ))}
            {Array.from({ length: 7 }).map((_, i) => (
              <path key={`h${i}`} d={`M0 ${i * 40}H400`} />
            ))}
          </g>
        )}
        {variant === 'waves' && (
          <g fill="none" stroke={`url(#pg-${variant})`} strokeWidth="2">
            {Array.from({ length: 9 }).map((_, i) => (
              <path key={i} d={`M-10 ${40 + i * 24} C 80 ${10 + i * 24}, 140 ${80 + i * 24}, 210 ${40 + i * 24} S 340 ${10 + i * 24}, 410 ${40 + i * 24}`} />
            ))}
          </g>
        )}
        {variant === 'sun' && (
          <g>
            <circle cx="200" cy="140" r="86" fill={`url(#pg-${variant})`} />
            {[150, 170, 190, 210].map((y, i) => (
              <rect key={y} x="100" y={y} width="200" height={3 + i * 2} fill="var(--poster-bg)" />
            ))}
          </g>
        )}
      </svg>
    </div>
  );
}
