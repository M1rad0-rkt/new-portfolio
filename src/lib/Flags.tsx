/** Drapeaux ronds dessinés en SVG (aucune image externe). */
interface FlagProps {
  size?: number;
  className?: string;
}

export function FlagFR({ size = 20, className }: FlagProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="flag-fr">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-fr)">
        <rect width="8" height="24" fill="#0055A4" />
        <rect x="8" width="8" height="24" fill="#FFFFFF" />
        <rect x="16" width="8" height="24" fill="#EF4135" />
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="currentColor" strokeOpacity="0.22" />
    </svg>
  );
}

export function FlagGB({ size = 20, className }: FlagProps) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="flag-gb">
          <circle cx="12" cy="12" r="12" />
        </clipPath>
      </defs>
      <g clipPath="url(#flag-gb)">
        <rect width="24" height="24" fill="#012169" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#FFFFFF" strokeWidth="4.6" />
        <path d="M0 0L24 24M24 0L0 24" stroke="#C8102E" strokeWidth="1.8" />
        <path d="M12 0V24M0 12H24" stroke="#FFFFFF" strokeWidth="7" />
        <path d="M12 0V24M0 12H24" stroke="#C8102E" strokeWidth="4" />
      </g>
      <circle cx="12" cy="12" r="11.5" fill="none" stroke="currentColor" strokeOpacity="0.22" />
    </svg>
  );
}
