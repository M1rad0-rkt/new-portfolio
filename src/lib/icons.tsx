/**
 * Point d'entrée unique des icônes : Paps Icons (@devpaps/paps-icon).
 * La bibliothèque ne contient pas de logos de marques (GitHub, LinkedIn) :
 * ces deux glyphes sont dessinés à la main dans BrandIcons.tsx.
 */
import {
  Analytics,
  Build,
  Chat,
  Check,
  Close,
  Code,
  ContentCopy,
  Download,
  Email,
  Language,
  LaptopChromebook,
  Layers,
  Lightbulb,
  LocationOn,
  Menu,
  NorthEast,
  Send,
  South,
  WbSunny,
  Brightness3,
  ArrowForward,
  ArrowBack,
  Addchart,
  DataUsage,
  School,
  Work,
  Translate,
  Edit,
  Delete,
  Add,
  Lock,
  LockOpen,
  ArrowUpward,
  ArrowDownward,
  CloudUpload,
} from '@devpaps/paps-icon';
import type { ComponentType } from 'react';

export interface IconProps {
  title?: string;
  color?: string;
  width?: number | string;
  height?: number | string;
}

type PapsIcon = ComponentType<IconProps>;

/** Rend une icône Paps à la taille voulue, colorée par `currentColor`. */
export function icon(Component: PapsIcon, size = 20) {
  return function Wrapped({ size: s = size, className }: { size?: number; className?: string }) {
    return (
      <span className={`ico ${className ?? ''}`} aria-hidden="true" style={{ width: s, height: s }}>
        <Component color="currentColor" width={s} height={s} />
      </span>
    );
  };
}

export const IconAnalytics = icon(Analytics);
export const IconBuild = icon(Build);
export const IconChat = icon(Chat);
export const IconCheck = icon(Check);
export const IconClose = icon(Close);
export const IconCode = icon(Code);
export const IconCopy = icon(ContentCopy);
export const IconDownload = icon(Download);
export const IconMail = icon(Email);
export const IconLanguage = icon(Language);
export const IconLaptop = icon(LaptopChromebook);
export const IconLayers = icon(Layers);
export const IconBulb = icon(Lightbulb);
export const IconPin = icon(LocationOn);
export const IconMenu = icon(Menu);
export const IconExternal = icon(NorthEast);
export const IconSend = icon(Send);
export const IconDown = icon(South);
export const IconSun = icon(WbSunny);
export const IconMoon = icon(Brightness3);
export const IconArrowRight = icon(ArrowForward);
export const IconArrowLeft = icon(ArrowBack);
export const IconChart = icon(Addchart);
export const IconData = icon(DataUsage);
export const IconSchool = icon(School);
export const IconWork = icon(Work);
export const IconTranslate = icon(Translate);
export const IconEdit = icon(Edit);
export const IconDelete = icon(Delete);
export const IconAdd = icon(Add);
export const IconLock = icon(Lock);
export const IconLockOpen = icon(LockOpen);
export const IconUp = icon(ArrowUpward);
export const IconDownArrow = icon(ArrowDownward);
export const IconUpload = icon(CloudUpload);

/** Icônes dessinées à la main (absentes de la bibliothèque). */
export function IconStar({ size = 20, filled = true, className }: { size?: number; filled?: boolean; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
    >
      <path d="M12 3.2l2.65 5.57 6.1.78-4.47 4.2 1.14 6.05L12 16.86 6.58 19.8l1.14-6.05-4.47-4.2 6.1-.78L12 3.2z" />
    </svg>
  );
}

export function IconCoffee({ size = 18, className }: { size?: number; className?: string }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 9h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V9z" />
      <path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H15.6" />
      <path d="M8 3.5c-.8 1 .8 1.6 0 2.8M12 3.5c-.8 1 .8 1.6 0 2.8" />
    </svg>
  );
}
