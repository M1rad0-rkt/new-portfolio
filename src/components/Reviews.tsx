import { useRef, useState, type FormEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { useAdmin } from '../admin/AdminProvider';
import { supabase } from '../lib/supabase';
import { useReviews, type Review } from '../content/reviews';
import { IconCheck, IconDelete, IconSend, IconStar } from '../lib/icons';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';

const COOLDOWN_KEY = 'mirado.review';
const COOLDOWN_MS = 60_000;
const MAX = 600;

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'wait';
type Errors = Partial<Record<'name' | 'message' | 'rating', string>>;

function Stars({ value, label }: { value: number; label: string }) {
  return (
    <span className="review__stars" role="img" aria-label={label}>
      {[1, 2, 3, 4, 5].map((n) => (
        <IconStar key={n} size={16} filled={n <= value} />
      ))}
    </span>
  );
}

export function Reviews() {
  const { t, lang } = useI18n();
  const r = t.reviews;
  const admin = useAdmin();
  const { reviews, loading, error, submit, setApproved, remove } = useReviews();

  const [rating, setRating] = useState(0);
  const [count, setCount] = useState(0);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');
  const [busy, setBusy] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Sans Supabase, aucun avis ne peut être stocké : la section n'est pas affichée.
  if (!supabase) return null;

  const moderating = admin.isAdmin && admin.editing;
  const published = reviews.filter((x) => x.approved);
  const pending = moderating ? reviews.filter((x) => !x.approved) : [];
  const ratingLabel = (n: number) => r.ratingOf.replace('{n}', String(n));
  const dateFmt = new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { month: 'long', year: 'numeric' });

  async function act(id: string, fn: () => Promise<void>) {
    setBusy(id);
    try {
      await fn();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Action impossible.');
    } finally {
      setBusy(null);
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) ?? '').trim();

    // Champ piège (invisible pour un humain) : un robot le remplit, on fait semblant d'accepter.
    if (v('website')) {
      setStatus('sent');
      form.reset();
      return;
    }

    const values = { name: v('name'), role: v('role'), message: v('message') };
    const next: Errors = {};
    if (!values.name) next.name = r.required;
    if (!values.message) next.message = r.required;
    else if (values.message.length < 10) next.message = r.tooShort;
    if (!rating) next.rating = r.ratingRequired;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"], .stars-input[aria-invalid="true"] input')?.focus();
      return;
    }

    try {
      const last = Number(localStorage.getItem(COOLDOWN_KEY) ?? 0);
      if (Date.now() - last < COOLDOWN_MS) {
        setStatus('wait');
        return;
      }
    } catch {
      /* stockage indisponible : on ne limite pas côté navigateur */
    }

    setStatus('sending');
    try {
      await submit({ name: values.name, role: values.role || null, rating, message: values.message });
      try {
        localStorage.setItem(COOLDOWN_KEY, String(Date.now()));
      } catch {
        /* ignoré */
      }
      setStatus('sent');
      form.reset();
      setRating(0);
      setCount(0);
    } catch {
      setStatus('error');
    }
  }

  const card = (rv: Review, pendingCard: boolean) => (
    <article key={rv.id} className={`review ${pendingCard ? 'is-pending' : ''}`}>
      {pendingCard ? <p className="review__flag mono">En attente de validation</p> : null}
      <Stars value={rv.rating} label={ratingLabel(rv.rating)} />
      <blockquote className="review__text">{rv.message}</blockquote>
      <p className="review__who">
        <span className="review__name">{rv.name}</span>
        {rv.role ? <span className="review__role">{rv.role}</span> : null}
        <time className="review__date mono" dateTime={rv.created_at}>
          {dateFmt.format(new Date(rv.created_at))}
        </time>
      </p>
      {moderating ? (
        <div className="review__actions" role="group" aria-label={`Modération : ${rv.name}`}>
          {pendingCard ? (
            <button type="button" className="btn btn--tiny btn--solid" disabled={busy === rv.id} onClick={() => act(rv.id, () => setApproved(rv.id, true))}>
              <IconCheck size={14} />
              Approuver
            </button>
          ) : (
            <button type="button" className="btn btn--tiny" disabled={busy === rv.id} onClick={() => act(rv.id, () => setApproved(rv.id, false))}>
              Masquer
            </button>
          )}
          <button
            type="button"
            className="btn btn--tiny review__danger"
            disabled={busy === rv.id}
            onClick={() => {
              if (window.confirm(`Supprimer l’avis de « ${rv.name} » ? Cette action est définitive.`)) void act(rv.id, () => remove(rv.id));
            }}
          >
            <IconDelete size={14} />
            Supprimer
          </button>
        </div>
      ) : null}
    </article>
  );

  return (
    <section id="reviews" className="section section--tint section--reviews" aria-labelledby="reviews-title">
      <div className="wrap">
        <SectionHead id="reviews-title" index="06" kicker={r.kicker} title={r.title} subtitle={r.subtitle} />

        <div className="reviews">
          <div className="reviews__list">
            {pending.length ? (
              <div className="reviews__pending">
                <p className="mono reviews__pending-title">
                  Avis à valider ({pending.length})
                </p>
                {pending.map((x) => card(x, true))}
              </div>
            ) : null}

            {loading ? (
              <p className="reviews__state mono" role="status">
                {r.loading}
              </p>
            ) : error ? (
              <p className="reviews__state" role="status">
                {r.loadError}
              </p>
            ) : published.length ? (
              published.map((x) => card(x, false))
            ) : (
              <p className="reviews__empty">{r.empty}</p>
            )}
          </div>

          <Reveal className="reviews__form" delay={100}>
            <form ref={formRef} onSubmit={onSubmit} noValidate aria-labelledby="review-form-title">
              <h3 id="review-form-title" className="form__title">
                {r.formTitle}
              </h3>
              <p className="form__note mono">{r.formNote}</p>

              <div className="form__grid">
                <div className="field">
                  <label htmlFor="rv-name">{r.name}</label>
                  <input
                    id="rv-name"
                    name="name"
                    type="text"
                    maxLength={80}
                    autoComplete="name"
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? 'rv-name-err' : undefined}
                  />
                  {errors.name ? (
                    <p className="field__err" id="rv-name-err">
                      {errors.name}
                    </p>
                  ) : null}
                </div>
                <div className="field">
                  <label htmlFor="rv-role">{r.role}</label>
                  <input id="rv-role" name="role" type="text" maxLength={80} autoComplete="organization-title" />
                </div>
              </div>

              <fieldset className="field stars-fieldset">
                <legend>{r.rating}</legend>
                <div className="stars-input" aria-invalid={errors.rating ? true : undefined}>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <label key={n} className={n <= rating ? 'is-on' : ''}>
                      <input
                        type="radio"
                        name="rating"
                        value={n}
                        checked={rating === n}
                        onChange={() => setRating(n)}
                        aria-label={ratingLabel(n)}
                      />
                      <IconStar size={30} filled={n <= rating} />
                    </label>
                  ))}
                </div>
                {errors.rating ? <p className="field__err">{errors.rating}</p> : null}
              </fieldset>

              <div className="field">
                <label htmlFor="rv-message">{r.message}</label>
                <textarea
                  id="rv-message"
                  name="message"
                  rows={5}
                  maxLength={MAX}
                  onChange={(e) => setCount(e.target.value.length)}
                  aria-invalid={errors.message ? true : undefined}
                  aria-describedby={errors.message ? 'rv-message-err' : undefined}
                />
                <p className="field__count mono" aria-hidden="true">
                  {count} / {MAX}
                </p>
                {errors.message ? (
                  <p className="field__err" id="rv-message-err">
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {/* Champ piège anti-robots : masqué aux humains et aux lecteurs d'écran */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="rv-website">Website</label>
                <input id="rv-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
              </div>

              <button type="submit" className="btn btn--solid btn--block" disabled={status === 'sending'}>
                <IconSend size={18} />
                {status === 'sending' ? r.sending : r.send}
              </button>
              <p className={`form__status ${status === 'error' || status === 'wait' ? 'is-error' : ''}`} role="status" aria-live="polite">
                {status === 'sent' && r.sent}
                {status === 'error' && r.error}
                {status === 'wait' && r.wait}
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
