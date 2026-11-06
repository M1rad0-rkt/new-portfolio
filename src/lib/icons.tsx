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
