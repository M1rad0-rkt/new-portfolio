import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useAdmin, type EditorTarget } from './AdminProvider';
import { useContent } from '../content/ContentProvider';
import { defaultText, TEXT_LABELS, type TextKey } from '../content/texts';
import type { L } from '../content/types';
import { BUCKET, supabase } from '../lib/supabase';
import { IconClose, IconUpload } from '../lib/icons';
import { SCHEMAS, fromDraft, missingRequired, toDraft, type Field } from './schemas';

type Draft = Record<string, unknown>;
type Pair = { fr: string; en: string };

async function uploadImage(file: File, folder: string): Promise<string> {
  if (!supabase) throw new Error('Supabase n’est pas configuré.');
  if (!file.type.startsWith('image/')) throw new Error('Le fichier doit être une image.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Image trop lourde (5 Mo maximum).');
  const ext = (file.name.split('.').pop() ?? 'png').toLowerCase().replace(/[^a-z0-9]/g, '') || 'png';
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw new Error(`Téléversement impossible : ${error.message}`);
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

function FieldControl({
  field,
  value,
  onChange,
  onError,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
  onError: (m: string) => void;
}) {
  const id = `ed-${field.key}`;
  const [uploading, setUploading] = useState(false);

  switch (field.type) {
    case 'bool':
      return (
        <label className="af af--check">
          <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
          <span>{field.label}</span>
        </label>
      );
    case 'select':
      return (
        <div className="af">
          <label htmlFor={id}>{field.label}</label>
          <select id={id} value={String(value)} onChange={(e) => onChange(e.target.value)}>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      );
    case 'l-text':
    case 'l-textarea':
    case 'l-lines': {
      const pair = value as Pair;
      const multi = field.type !== 'l-text';
      return (
        <fieldset className="af af--pair">
          <legend>
            {field.label}
            {'hint' in field && field.hint ? <span className="af__hint"> — {field.hint}</span> : null}
          </legend>
          {(['fr', 'en'] as const).map((lang) => (
            <div key={lang} className="af__lang">
              <label htmlFor={`${id}-${lang}`} className="mono">
                {lang.toUpperCase()}
              </label>
              {multi ? (
                <textarea
                  id={`${id}-${lang}`}
                  rows={field.type === 'l-lines' ? 4 : 3}
                  value={pair[lang]}
                  onChange={(e) => onChange({ ...pair, [lang]: e.target.value })}
                />
              ) : (
                <input
                  id={`${id}-${lang}`}
                  value={pair[lang]}
                  onChange={(e) => onChange({ ...pair, [lang]: e.target.value })}
                />
              )}
            </div>
          ))}
        </fieldset>
      );
    }
    case 'image':
      return (
        <div className="af">
          <label htmlFor={id}>{field.label}</label>
          <div className="af__image">
            {value ? <img src={String(value)} alt="" /> : <span className="af__noimg mono">Aucune image</span>}
            <div className="af__imgctl">
              <input
                id={id}
                type="url"
                placeholder="https://… ou téléverser"
                value={String(value)}
                onChange={(e) => onChange(e.target.value)}
              />
              <label className="btn btn--tiny af__upload">
                <IconUpload size={14} />
                {uploading ? 'Envoi…' : 'Téléverser'}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  disabled={uploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    setUploading(true);
                    try {
                      onChange(await uploadImage(file, field.folder));
                    } catch (err) {
                      onError(err instanceof Error ? err.message : 'Téléversement impossible.');
                    } finally {
                      setUploading(false);
                    }
                  }}
                />
              </label>
              {value ? (
                <button type="button" className="btn btn--tiny" onClick={() => onChange('')}>
                  Retirer
                </button>
              ) : null}
            </div>
          </div>
        </div>
      );
    case 'textarea':
      return (
        <div className="af">
          <label htmlFor={id}>{field.label}</label>
          <textarea id={id} rows={4} value={String(value)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    default:
      return (
        <div className="af">
          <label htmlFor={id}>
            {field.label}
            {'hint' in field && field.hint ? <span className="af__hint"> — {field.hint}</span> : null}
          </label>
          <input
            id={id}
            type={field.type === 'url' ? 'url' : 'text'}
            value={String(value)}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
  }
}

function EditorDialog({ target, onClose }: { target: EditorTarget; onClose: () => void }) {
  const content = useContent();
  const ref = useRef<HTMLDialogElement>(null);
  const isText = target.collection === 'texts';
  const textKey = target.textKey ?? '';

  const schema = isText ? null : SCHEMAS[target.collection as keyof typeof SCHEMAS];
  const fields: Field[] = isText
    ? [{ key: 'value', label: TEXT_LABELS[textKey as TextKey] ?? textKey, type: 'l-textarea' }]
    : schema!.fields;

  const [initial] = useState<Draft>(() =>
    isText
      ? {
          value: content.textOverride(textKey) ?? {
            fr: defaultText(textKey, 'fr'),
            en: defaultText(textKey, 'en'),
          },
        }
      : ((target.entry?.data as Draft | undefined) ?? schema!.empty()),
  );
  const [draft, setDraft] = useState<Draft>(() => toDraft(fields, initial));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const dlg = ref.current;
    if (dlg && !dlg.open) dlg.showModal();
  }, []);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const missing = missingRequired(fields, draft);
    if (missing) {
      setError(`Le champ « ${missing} » est obligatoire.`);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const data = { ...initial, ...fromDraft(fields, draft) };
      if (isText) await content.saveText(textKey, data.value as L);
      else await content.save(target.collection, target.entry?.id ?? null, data);
      ref.current?.close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Enregistrement impossible.');
      setBusy(false);
    }
  }

  const title = isText
    ? 'Modifier le texte'
    : target.entry
      ? `Modifier ${schema!.singular}`
      : `Ajouter ${schema!.singular}`;

  return (
    <dialog
      ref={ref}
      className="adm-dialog"
      aria-labelledby="ed-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === ref.current && !busy) ref.current?.close();
      }}
    >
      <form className="adm-form" onSubmit={submit} noValidate>
        <header className="adm-form__head">
          <h2 id="ed-title">{title}</h2>
          <button type="button" className="icon-btn" aria-label="Fermer" onClick={() => ref.current?.close()}>
            <IconClose size={20} />
          </button>
        </header>

        <div className="adm-form__body">
          {fields.map((f) => (
            <FieldControl
              key={f.key}
              field={f}
              value={draft[f.key]}
              onChange={(v) => setDraft((d) => ({ ...d, [f.key]: v }))}
              onError={setError}
            />
          ))}
        </div>

        <footer className="adm-form__foot">
          <p className="adm-form__err" role="alert">
            {error}
          </p>
          <button type="button" className="btn btn--line" onClick={() => ref.current?.close()} disabled={busy}>
            Annuler
          </button>
          <button type="submit" className="btn btn--solid" disabled={busy}>
            {busy ? 'Enregistrement…' : 'Enregistrer'}
          </button>
        </footer>
      </form>
    </dialog>
  );
}

export function EntryEditor() {
  const { editor, closeEditor } = useAdmin();
  if (!editor) return null;
  return <EditorDialog key={`${editor.collection}:${editor.entry?.id ?? editor.textKey ?? 'new'}`} target={editor} onClose={closeEditor} />;
}
