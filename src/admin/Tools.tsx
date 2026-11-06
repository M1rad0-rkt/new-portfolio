import { useState, type ElementType } from 'react';
import { useAdmin } from './AdminProvider';
import { useCanEdit } from './useCanEdit';
import { useContent } from '../content/ContentProvider';
import { useI18n } from '../i18n/I18nProvider';
import type { Collection, Entry } from '../content/types';
import { IconAdd, IconDelete, IconDownArrow, IconEdit, IconUp } from '../lib/icons';

/** Petite barre d'outils posée sur un élément (modifier / déplacer / supprimer). */
export function ItemTools({
  collection,
  entry,
  index,
  count,
  label,
}: {
  collection: Collection;
  entry: Entry;
  index: number;
  count: number;
  label: string;
}) {
  const canEdit = useCanEdit();
  const { openEditor } = useAdmin();
  const { remove, move } = useContent();
  const [busy, setBusy] = useState(false);

  if (!canEdit) return null;

  async function run(fn: () => Promise<void>) {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      window.alert(e instanceof Error ? e.message : 'Action impossible.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="itemtools" role="group" aria-label={`Outils : ${label}`}>
      <button type="button" disabled={busy || index === 0} onClick={() => run(() => move(collection, entry.id, -1))} aria-label="Monter" title="Monter">
        <IconUp size={16} />
      </button>
      <button type="button" disabled={busy || index === count - 1} onClick={() => run(() => move(collection, entry.id, 1))} aria-label="Descendre" title="Descendre">
        <IconDownArrow size={16} />
      </button>
      <button type="button" disabled={busy} onClick={() => openEditor({ collection, entry })} aria-label={`Modifier ${label}`} title="Modifier">
        <IconEdit size={16} />
      </button>
      <button
        type="button"
        className="itemtools__danger"
        disabled={busy}
        onClick={() => {
          if (window.confirm(`Supprimer « ${label} » ? Cette action est définitive.`)) void run(() => remove(entry.id));
        }}
        aria-label={`Supprimer ${label}`}
        title="Supprimer"
      >
        <IconDelete size={16} />
      </button>
    </div>
  );
}

/** Bouton « Ajouter » affiché en bas d'une section en mode édition. */
export function AddEntry({ collection, label }: { collection: Collection; label: string }) {
  const canEdit = useCanEdit();
  const { openEditor } = useAdmin();
  if (!canEdit) return null;
  return (
    <button type="button" className="addentry" onClick={() => openEditor({ collection, entry: null })}>
      <IconAdd size={18} />
      {label}
    </button>
  );
}

/** Texte issu des dictionnaires, remplaçable par l'admin (avec crayon en mode édition). */
export function Txt({ k, as: Tag = 'span', className }: { k: string; as?: ElementType; className?: string }) {
  const { lang } = useI18n();
  const { text } = useContent();
  const canEdit = useCanEdit();
  const { openEditor } = useAdmin();
  return (
    <Tag className={className}>
      {text(k, lang)}
      {canEdit ? (
        <button
          type="button"
          className="txt-edit"
          onClick={() => openEditor({ collection: 'texts', textKey: k })}
          aria-label="Modifier ce texte"
          title="Modifier ce texte"
        >
          <IconEdit size={14} />
        </button>
      ) : null}
    </Tag>
  );
}
