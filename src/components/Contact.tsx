import { useState, type FormEvent } from 'react';
import { useI18n } from '../i18n/I18nProvider';
import { profile, whatsappHref } from '../data/profile';
import { GithubMark, LinkedinMark } from '../lib/BrandIcons';
import { IconCheck, IconCopy, IconExternal, IconMail, IconPin, IconSend } from '../lib/icons';
import { Reveal } from './Reveal';
import { Txt } from '../admin/Tools';
import { SectionHead } from './SectionHead';

type Status = 'idle' | 'sending' | 'sentDirect' | 'sentMailto' | 'error';
type Errors = Partial<Record<'name' | 'email' | 'subject' | 'message', string>>;
type Channel = 'message' | 'google' | 'whatsapp';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Contact() {
  const { t } = useI18n();
  const c = t.contact;
  const direct = Boolean(profile.formEndpoint);
  const hasGoogle = Boolean(profile.googleFormUrl);
  const hasWhatsapp = Boolean(profile.whatsapp);

  const [channel, setChannel] = useState<Channel>('message');
  const [status, setStatus] = useState<Status>('idle');
  const [errors, setErrors] = useState<Errors>({});
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible */
    }
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const v = (k: string) => String(data.get(k) ?? '').trim();
    const values = { name: v('name'), email: v('email'), subject: v('subject'), message: v('message') };

    const next: Errors = {};
    (Object.keys(values) as (keyof typeof values)[]).forEach((k) => {
      if (!values[k]) next[k] = c.required;
    });
    if (!next.email && !EMAIL_RE.test(values.email)) next.email = c.invalidEmail;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
      return;
    }

    if (direct) {
      setStatus('sending');
      try {
        const res = await fetch(profile.formEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error(String(res.status));
        setStatus('sentDirect');
        form.reset();
      } catch {
        setStatus('error');
      }
      return;
    }

    const subject = encodeURIComponent(values.subject || c.defaultSubject);
    const body = encodeURIComponent(`${c.name}: ${values.name}\n${c.emailField}: ${values.email}\n\n${values.message}`);
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setStatus('sentMailto');
    form.reset();
  }

  const field = (name: keyof Errors, label: string, type = 'text', autoComplete?: string) => (
    <div className="field">
      <label htmlFor={`f-${name}`}>{label}</label>
      <input
        id={`f-${name}`}
        name={name}
        type={type}
        autoComplete={autoComplete}
        aria-invalid={errors[name] ? true : undefined}
        aria-describedby={errors[name] ? `e-${name}` : undefined}
      />
      {errors[name] ? (
        <p className="field__err" id={`e-${name}`}>
          {errors[name]}
        </p>
      ) : null}
    </div>
  );

  const channels: { id: Channel; label: string; show: boolean }[] = [
    { id: 'message', label: c.channelMessage, show: true },
    { id: 'google', label: c.channelGoogle, show: hasGoogle },
    { id: 'whatsapp', label: c.channelWhatsapp, show: hasWhatsapp },
  ];

  return (
    <section id="contact" className="section section--contact" aria-labelledby="contact-title">
      <div className="wrap">
        <SectionHead id="contact-title" index="06" kicker={c.kicker} title={c.title} subtitle={<Txt k="contact.subtitle" />} />

        <div className="contact">
          <Reveal className="contact__info">
            <ul className="contact__list">
              <li>
                <span className="mono contact__label">
                  <IconMail size={16} />
                  {c.email}
                </span>
                <span className="contact__row">
                  <a className="contact__mail" href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                  <button type="button" className="btn btn--tiny" onClick={copyEmail} aria-label={c.copyLabel}>
                    {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
                    <span aria-live="polite">{copied ? c.copied : c.copy}</span>
                  </button>
                </span>
              </li>
              {profile.phone ? (
                <li>
                  <span className="mono contact__label">{c.phone}</span>
                  <span className="contact__value">
                    <a href={`tel:${profile.phone.replace(/\s/g, '')}`}>{profile.phone}</a>
                  </span>
                </li>
              ) : null}
              <li>
                <span className="mono contact__label">
                  <IconPin size={16} />
                  {c.location}
                </span>
                <span className="contact__value">{c.locationValue}</span>
              </li>
            </ul>

            <div className="contact__social">
              <a className="btn btn--line" href={profile.github} target="_blank" rel="noopener noreferrer">
                <GithubMark size={18} />
                GitHub
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
              <a className="btn btn--line" href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                <LinkedinMark size={18} />
                LinkedIn
                <span className="sr-only">{t.a11y.externalLink}</span>
              </a>
              {hasWhatsapp ? (
                <a
                  className="btn btn--line contact__wa"
                  href={whatsappHref(c.whatsappPrefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                  <span className="sr-only">{t.a11y.externalLink}</span>
                </a>
              ) : null}
            </div>
          </Reveal>

          <Reveal className="contact__form" delay={100}>
            <div className="contact__channels seg" role="tablist" aria-label={c.channelsLabel}>
              {channels
                .filter((ch) => ch.show)
                .map((ch) => (
                  <button
                    key={ch.id}
                    type="button"
                    role="tab"
                    className="seg__btn mono"
                    aria-selected={channel === ch.id}
                    aria-pressed={channel === ch.id}
                    onClick={() => setChannel(ch.id)}
                  >
                    {ch.label}
                  </button>
                ))}
            </div>

            {channel === 'message' && (
              <>
                <h3 className="contact__form-title">{c.formTitle}</h3>
                <p className="contact__note mono">{direct ? c.formNoteDirect : c.formNoteMailto}</p>

                <form onSubmit={onSubmit} noValidate>
                  <div className="contact__grid">
                    {field('name', c.name, 'text', 'name')}
                    {field('email', c.emailField, 'email', 'email')}
                  </div>
                  {field('subject', c.subject, 'text')}
                  <div className="field">
                    <label htmlFor="f-message">{c.message}</label>
                    <textarea
                      id="f-message"
                      name="message"
                      rows={5}
                      aria-invalid={errors.message ? true : undefined}
                      aria-describedby={errors.message ? 'e-message' : undefined}
                    />
                    {errors.message ? (
                      <p className="field__err" id="e-message">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="contact__actions">
                    <button type="submit" className="btn btn--solid" disabled={status === 'sending'}>
                      <IconSend size={18} />
                      {status === 'sending' ? c.sending : direct ? c.send : c.openMail}
                    </button>
                  </div>

                  {status === 'sentDirect' ? <p className="contact__feedback is-ok">{c.sentDirect}</p> : null}
                  {status === 'sentMailto' ? <p className="contact__feedback is-ok">{c.sentMailto}</p> : null}
                  {status === 'error' ? <p className="contact__feedback is-err">{c.error}</p> : null}
                </form>
              </>
            )}

            {channel === 'google' && hasGoogle && (
              <div className="contact__google">
                <h3 className="contact__form-title">{c.googleTitle}</h3>
                <p className="contact__note mono">{c.googleNote}</p>
                <div className="contact__iframe-wrap">
                  <iframe
                    title={c.googleTitle}
                    src={profile.googleFormUrl}
                    className="contact__iframe"
                    loading="lazy"
                  />
                </div>
                <a className="btn btn--line" href={profile.googleFormUrl} target="_blank" rel="noopener noreferrer">
                  <IconExternal size={16} />
                  {c.googleOpen}
                </a>
              </div>
            )}

            {channel === 'whatsapp' && hasWhatsapp && (
              <div className="contact__whatsapp">
                <h3 className="contact__form-title">{c.whatsappTitle}</h3>
                <p className="contact__note">{c.whatsappNote}</p>
                <p className="contact__value mono">{profile.phone || `+${profile.whatsapp}`}</p>
                <a
                  className="btn btn--solid contact__wa-cta"
                  href={whatsappHref(c.whatsappPrefill)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {c.whatsappCta}
                  <IconExternal size={16} />
                </a>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
