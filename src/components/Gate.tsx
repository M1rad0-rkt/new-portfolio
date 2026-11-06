import { useCallback, useEffect, useRef, useState } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { IconArrowRight } from '../lib/icons';

const STORAGE_KEY = 'mirado.gate';

/** L'intro n'apparaît qu'une fois par session, et jamais si l'URL vise déjà une section (#projects…). */
export function shouldShowGate(): boolean {
  try {
    if (sessionStorage.getItem(STORAGE_KEY) === 'done') return false;
  } catch {
    /* stockage indisponible : on affiche l'intro */
  }
  return !window.location.hash;
}

const pageParts = () =>
  [document.getElementById('main'), document.querySelector('footer')].filter(
    (e): e is HTMLElement => !!e,
  );

export function Gate({ onDone }: { onDone: () => void }) {
  const { t } = useI18n();
  const g = t.gate;

  const [x, setX] = useState(0);
  const [drag, setDrag] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const start = useRef({ px: 0, x: 0, moved: false });
  const released = useRef(false);

  const maxX = () => {
    const el = trackRef.current;
    if (!el) return 0;
    const thumb = el.querySelector<HTMLElement>('.slide__thumb');
    // largeur utile = piste - padding (2 × 0.3rem ≈ 9.6px) - poignée
    return Math.max(0, el.clientWidth - (thumb?.offsetWidth ?? 0) - 10);
  };

  /** Réactive la page derrière l'intro (défilement + clavier/lecteurs d'écran). */
  const release = useCallback(() => {
    if (released.current) return;
    released.current = true;
    document.body.style.overflow = '';
    pageParts().forEach((el) => el.removeAttribute('inert'));
  }, []);

  const finish = useCallback(
    (focusHero: boolean) => {
      release();
      try {
        sessionStorage.setItem(STORAGE_KEY, 'done');
      } catch {
        /* ignoré */
      }
      setLeaving(true);
      if (focusHero) {
        window.scrollTo(0, 0);
        document.getElementById('hero-title')?.focus({ preventScroll: true });
      }
      window.setTimeout(onDone, 700);
    },
    [onDone, release],
  );

  // Verrouille le défilement et rend la page inerte tant que l'intro est ouverte.
  useEffect(() => {
    released.current = false;
    document.body.style.overflow = 'hidden';
    pageParts().forEach((el) => el.setAttribute('inert', ''));
    titleRef.current?.focus({ preventScroll: true });
    return release;
  }, [release]);

  // La navbar reste utilisable : cliquer sur un de ses liens ouvre le portfolio.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest('header a[href^="#"]');
      if (link) finish(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [finish]);

  function onDown(e: PointerEvent<HTMLButtonElement>) {
    if (leaving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    start.current = { px: e.clientX, x, moved: false };
    setDrag(true);
  }
  function onMove(e: PointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    const dx = e.clientX - start.current.px;
    if (Math.abs(dx) > 4) start.current.moved = true;
    setX(Math.min(maxX(), Math.max(0, start.current.x + dx)));
  }
  function onUp() {
    if (!drag) return;
    setDrag(false);
    const max = maxX();
    if (x >= max * 0.85 || !start.current.moved) {
      // arrivé au bout, ou simple clic / toucher : on entre
      setX(max);
      finish(true);
    } else {
      setX(0);
    }
  }
  function onKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(maxX(), x + maxX() / 4);
      setX(next);
      if (next >= maxX()) finish(true);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setX(Math.max(0, x - maxX() / 4));
    }
  }

  const fadeOut = Math.max(0, 1 - x / (maxX() || 1) * 1.6);

  return (
    <section className={`gate ${leaving ? 'is-leaving' : ''}`} aria-labelledby="gate-title">
      <div className="gate__inner wrap">
        <p className="gate__kicker mono">
          <span>№ 00</span>
          <span className="sec-head__rule" aria-hidden="true" />
          <span>{g.kicker}</span>
        </p>
        <h2 id="gate-title" ref={titleRef} tabIndex={-1} className="gate__title">
          {g.title}
        </h2>
        <p className="gate__intro">{g.intro}</p>

        <div ref={trackRef} className={`slide ${drag ? 'is-drag' : ''}`}>
          <span className="slide__fill" style={{ width: `calc(${x}px + var(--thumb))` }} />
          <span className="slide__label mono" style={{ opacity: fadeOut }} aria-hidden="true">
            {g.slide}
          </span>
          <button
            type="button"
            className="slide__thumb"
            aria-label={g.slideAria}
            style={{ transform: `translateX(${x}px)` }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
            onKeyDown={onKey}
            onClick={(e) => {
              // Entrée / Espace (clic clavier) ouvre directement
              if (e.detail === 0) finish(true);
            }}
          >
            <span className={x === 0 && !drag ? 'slide__hint' : undefined}>
              <IconArrowRight size={22} />
            </span>
          </button>
        </div>

        <button type="button" className="gate__skip mono" onClick={() => finish(true)}>
          {g.skip}
        </button>
      </div>
    </section>
  );
}
