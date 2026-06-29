/**
 * Notes.tsx
 * Sits above the Controls / Ingredients / Instructions band.
 * Two distinct sections:
 *
 *   1. Editorial notes — parsed from the recipe markdown (read-only).
 *      These are the author's technique explanations, substitution notes, etc.
 *
 *   2. Cook notes — written by the person cooking.
 *      Persisted to localStorage keyed by recipeSlug.
 *      Add, edit in-place, and delete. Each note shows its creation date.
 *
 * Persistence is handled entirely in this component via localStorage.
 * Recipe.tsx passes the initial hydrated cookNotes and the four CRUD handlers.
 */

import React, { useState, useId } from "react";
import type { CookNote, CookNotesProps } from "../types/recipe-component-types";
import type { NoteItemProps } from "../types/types";

export function Notes({
  editorialNotes,
  cookNotes,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
}: CookNotesProps): React.ReactElement {
  const hasEditorialNotes = editorialNotes.notes.length > 0;
  const hasCookNotes = cookNotes.length > 0;

  if (!hasEditorialNotes && !hasCookNotes) {
    // Still render the cook-notes section so the cook can add their first note
  }

  return (
    <aside aria-label="Recipe notes" data-component="Notes">
      {/* ── Editorial notes (from the markdown author) ───────────────────── */}
      {hasEditorialNotes && (
        <section aria-label="Recipe tips and notes" data-section="editorial-notes">
          <h2>Notes</h2>
          <dl data-element="editorial-note-list">
            {editorialNotes.notes.map((note) => (
              <EditorialNote key={note.index} note={note} />
            ))}
          </dl>
        </section>
      )}

      {/* ── Cook notes (user-authored, persistent) ───────────────────────── */}
      <section aria-label="Your notes" data-section="cook-notes">
        <h2>Your Notes</h2>

        {hasCookNotes && (
          <ul data-element="cook-note-list" aria-live="polite">
            {cookNotes.map((note) => (
              <CookNoteItem
                key={note.id}
                note={note}
                onUpdate={onUpdateNote}
                onDelete={onDeleteNote}
              />
            ))}
          </ul>
        )}

        <AddNoteForm onAdd={onAddNote} />
      </section>
    </aside>
  );
}

// ── Editorial note ─────────────────────────────────────────────────────────────

function EditorialNote({ note }: { note: NoteItemProps }): React.ReactElement {
  return (
    <>
      {note.label && <dt data-element="note-label">{note.label}</dt>}
      <dd data-element="note-body" data-has-label={Boolean(note.label)}>
        {note.body}
      </dd>
    </>
  );
}

// ── Cook note item (view + inline edit) ────────────────────────────────────────

interface CookNoteItemProps {
  note: CookNote;
  onUpdate: (id: string, body: string) => void;
  onDelete: (id: string) => void;
}

function CookNoteItem({ note, onUpdate, onDelete }: CookNoteItemProps): React.ReactElement {
  const [isEditing, setIsEditing] = useState(false);
  const [draftBody, setDraftBody] = useState(note.body);
  const textareaId = useId();

  function handleSave() {
    const trimmed = draftBody.trim();
    if (trimmed && trimmed !== note.body) {
      onUpdate(note.id, trimmed);
    }
    setIsEditing(false);
  }

  function handleCancel() {
    setDraftBody(note.body);
    setIsEditing(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  }

  const createdDate = formatDate(note.createdAt);
  const updatedDate = note.updatedAt !== note.createdAt ? formatDate(note.updatedAt) : null;

  return (
    <li data-element="cook-note" data-note-id={note.id} data-editing={isEditing}>
      {isEditing ? (
        <div data-element="edit-form">
          <label htmlFor={textareaId} data-element="sr-only">
            Edit note
          </label>
          <textarea
            id={textareaId}
            value={draftBody}
            onChange={(e) => setDraftBody(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            aria-label="Edit your note"
            data-element="edit-textarea"
            rows={4}
          />
          <div data-element="edit-actions">
            <button
              type="button"
              onClick={handleSave}
              disabled={!draftBody.trim()}
              data-action="save"
            >
              Save
            </button>
            <button type="button" onClick={handleCancel} data-action="cancel">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div data-element="view">
          <p data-element="note-body">{note.body}</p>

          <div data-element="note-meta">
            <time dateTime={note.createdAt} data-element="created-at">
              Added {createdDate}
            </time>
            {updatedDate && (
              <time dateTime={note.updatedAt} data-element="updated-at">
                · Edited {updatedDate}
              </time>
            )}
          </div>

          <div data-element="note-actions">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              aria-label="Edit this note"
              data-action="edit"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(note.id)}
              aria-label="Delete this note"
              data-action="delete"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  );
}

// ── Add note form ──────────────────────────────────────────────────────────────

function AddNoteForm({ onAdd }: { onAdd: (body: string) => void }): React.ReactElement {
  const [body, setBody] = useState("");
  const textareaId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = body.trim();
    if (trimmed) {
      onAdd(trimmed);
      setBody("");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      const trimmed = body.trim();
      if (trimmed) {
        onAdd(trimmed);
        setBody("");
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} data-element="add-note-form" noValidate>
      <label htmlFor={textareaId} data-element="add-note-label">
        Add a note
      </label>
      <textarea
        id={textareaId}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Your observations, substitutions, adjustments…"
        aria-label="New note"
        data-element="add-textarea"
        rows={3}
      />
      <button type="submit" disabled={!body.trim()} data-action="add-note">
        Save note
      </button>
      <p data-element="hint" aria-hidden="true">
        ⌘ + Enter to save
      </p>
    </form>
  );
}

// ── Utility ────────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
